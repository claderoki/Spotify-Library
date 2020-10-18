import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable(
{
  providedIn: 'root'
})

export class ConfigService implements OnDestroy {
    public subscriptions : Subscription[] = []; 

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
    }

    public base_url = location.origin;
    public redirect_uri = this.base_url + "/auth";
    public scopes = "user-read-private user-read-recently-played user-read-currently-playing user-read-playback-state";

    private data = {};

    constructor(private http: HttpClient, private cookieService : CookieService) {
    }

    getAccessToken() {
        var expiryDate = new Date(this.cookieService.get("expiry_date"));

        if (! this.cookieService.get("access_token")) {
            this.authorizeSpotify();
        }
        else if ( new Date() > expiryDate) {
            if (this.cookieService.get("refresh_token")) {
                this.refreshToken();
                window.location.reload;
            }
            else {
                window.location.href = this.getAuthorizeUrl();
            }
        }
        return this.cookieService.get("access_token");
    }




    getAuthorizeUrl() {
        var client_id = this.data["clientId"];

        var url = "https://accounts.spotify.com/authorize";
        url += "?response_type=code";
        url += "&client_id=" + client_id;
        url += (this.scopes ? '&scope=' + encodeURIComponent(this.scopes) : '');
        url += "&redirect_uri=" + encodeURIComponent(this.redirect_uri);

        return url;
    }

    setupAuthenticationResponse(response) {
        this.subscriptions.push(response.subscribe(
            (val) => {
                this.cookieService.set("access_token", val["access_token"])

                var date : Date = new Date();
                date.setSeconds(date.getSeconds() + val["expires_in"]);

                this.cookieService.set("expiry_date", date.toISOString());
                if (val["refresh_token"]) {
                    this.cookieService.set("refresh_token", val["refresh_token"])
                }
                else {
                    this.cookieService.delete("refresh_token");
                }
                
                window.location.reload;
            },

            response => {
                console.log("POST call in error", response);
            },

            () => {
                console.log("The POST observable that sets up the authentication response is now complete.");
            }));

    }

    getHeaders() {
        return new HttpHeaders()
        .set("Authorization", "Basic " + btoa(this.data["clientId"] + ":"+this.data["clientSecret"]))
        .set("Content-type", "application/x-www-form-urlencoded")

    }

    refreshToken() {
        var url = "https://accounts.spotify.com/api/token";
        const body = new HttpParams()
        .set("grant_type", "refresh_token")
        .set("refresh_token", this.cookieService.get("refresh_token"))
        var headers = this.getHeaders();
        this.setupAuthenticationResponse(this.http.post(url, body, {headers}));
    }

    authorizeSpotify() {
        var code = this.cookieService.get("authenticationCode");
        var url = "https://accounts.spotify.com/api/token";

        const body = new HttpParams()
        .set("grant_type", "authorization_code")
        .set("code", code)
        .set("redirect_uri", this.redirect_uri)

        var headers = this.getHeaders();

        this.setupAuthenticationResponse(this.http.post(url, body, {headers}));
    }
}