import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ConfigService } from "../config.service";
import { SpotifyService } from "../spotify.service";
import { Observable, Subscription } from "rxjs";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"]
})
export class AuthComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  constructor(
    @Inject(ConfigService) private service,
    @Inject(SpotifyService) private spotify,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.subscriptions.push(
      this.route.queryParams.subscribe(
        (params: Params) => {
          console.log("Params subscriber (/auth)");
          let code = params["code"];
          if (code) {
            this.cookieService.deleteAll();

            this.cookieService.set("authenticationCode", code);
            this.service.authorizeSpotify();
          }
        },
        err => console.log("error", err),
        () => console.log("Finished setting up params")
      )
    );
  }

  ngOnInit(): void {}
}
