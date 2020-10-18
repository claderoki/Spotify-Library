import { Component, OnInit, Inject } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
selector: 'app-home',
templateUrl: './home.component.html',
styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit
{

    public authUrl = "";

    constructor(@Inject(ConfigService) private config)
    {

    }

    ngOnInit(): void
    {
        this.authUrl = this.config.getAuthorizeUrl();
    }

}
