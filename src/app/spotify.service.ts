import { Injectable, Inject, OnDestroy } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Injectable(
{
    providedIn: 'root'
})

export class SpotifyService implements OnDestroy
{
    public subscriptions : Subscription[] = []; 

    ngOnDestroy(): void
    {
        this.subscriptions.forEach(sub =>
        {
            sub.unsubscribe();
        });
    }


    constructor(@Inject(ConfigService) private service, @Inject(HttpClient) private http)
    {

    }

    getAuthHeader()
    {
        return new HttpHeaders({"Authorization" : "Bearer " + this.service.getAccessToken() });
    }

    getMe()
    {
        var url = "https://api.spotify.com/v1/me";
        var headers = this.getAuthHeader();

        return this.http.get(url, {headers});

    }

    getTracks(ids : String[])
    {
        console.log(ids);
        var url = "https://api.spotify.com/v1/tracks?ids=" + ids.join(",");
        
        var headers = this.getAuthHeader();

        return this.http.get(url, {headers});
    }



    getRecentlyPlayedSongs()
    {
        var url = "https://api.spotify.com/v1/me/player/recently-played";
        var headers = this.getAuthHeader();

        return this.http.get(url, {headers});
    }

    getCurrentlyPlaying()
    {
        var url = "https://api.spotify.com/v1/me/player/currently-playing";
        var headers = this.getAuthHeader();

        return this.http.get(url, {headers});
    }

    searchTracks(q)
    {
        var url = "https://api.spotify.com/v1/search?type=track&limit=21&q=" + encodeURI(q);
        var headers = this.getAuthHeader();

        return this.http.get(url, {headers});
    }

}
