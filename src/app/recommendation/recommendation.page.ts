import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { RecommendHikeTrail } from '../interfaces/recommendhiketrail';
import { BrowserTab } from '@ionic-native/browser-tab/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
  })
@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.page.html',
  styleUrls: ['./recommendation.page.scss'],
})
export class RecommendationPage implements OnInit {

  recommended: RecommendHikeTrail[];
  // travelTime;
  // showTime: boolean;
  constructor(private service: DataService, private browserTab: BrowserTab,
              private router: Router, private platform: Platform,
              private iab: InAppBrowser, private storage: Storage,
              private launchNavigator: LaunchNavigator,
              public loadingController: LoadingController) {
                
              }

  async doRefresh(event) {
    console.log('Begin async operation');
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 1000
    });
    await loading.present();
    const reset = await this.doLoader();
    console.log('reset is ' + reset);
    if (reset) {
      const loader = await this.loadingController.create({
        message: 'Something Went Wrong!',
        duration: 2000
      });
      await loader.present();
      this.router.navigateByUrl('');
    }
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }

  // async getTravelTime(lat, long) {
  //   console.log(`Travel time is...?`);
  //   this.travelTime = await this.service.getDuration(lat, long);
  //   this.showTime = true;
  // }

  async doLoader() {
    let reset = false;
    let loop = 0;

    while (loop < 3   && reset !== true || (this.recommended.length < 1 || this.recommended[0] === null)) {
      console.log('in loop ' + loop);
      const tempInterface = await this.service.getRecommendHikeTrail();
      if (this.recommended === null) {
          if (tempInterface != null) {
            this.recommended = tempInterface;
          } else if (tempInterface === this.recommended || tempInterface === null) {
            reset = true;
            console.log('tempinterface is null');
          }
        } else if (tempInterface[0].trailName !== this.recommended[0].trailName) {
          this.recommended = tempInterface;
        } else if (this.service.getLongitudeIsNaN() || this.service.getLatitudeIsNaN()) {
          console.log('GPS is turned off!');
          reset = true;
        } else if (this.recommended[0].trailName === '') {
          console.log('Theres no name for the paths!');
          reset = true;
        }
      loop++;
    }
    return reset;
  }

  openBrowserTab(url: string) {
    if (!this.platform.is('cordova')) {
      // doesn't work as well on android/"mobile"?
      let browser = this.iab.create(url, '_blank');
    }
    this.browserTab.isAvailable()
    .then(isAvailable => {
      if (isAvailable) {
        this.browserTab.openUrl(url);
      } else {
        console.log('no Inapp browser :(');
        // open URL with InAppBrowser instead or SafariViewController
      }
    });
  }

  goToMaps(latitude: number, longitude: number) {
    const url = `https://www.google.com/maps?saddr=${this.service.getLocation()}&daddr=${latitude},${longitude}`
    console.log(url);
    if (!this.platform.is('cordova')) {
      // doesn't work as well on android/"mobile"?
      let browser = this.iab.create(url, '_blank');
    }
    let app = this.launchNavigator.APP.GOOGLE_MAPS;
    console.log('apps: ' + this.launchNavigator.availableApps());

    const googleMaps = this.launchNavigator.isAppAvailable(this.launchNavigator.APP.GOOGLE_MAPS);
    if (!googleMaps) {
      this.launchNavigator.appSelection.userChoice.set(app, function(){
        console.log('User preferred app is set');
      });
      let appName = this.launchNavigator.appSelection.userChoice.get(function(app) {
          console.log('User preferred app is: ' + this.launchNavigator.getAppDisplayName(app));
      });

      app = this.launchNavigator.APP.appName.toUpperCase();
    }

    let options: LaunchNavigatorOptions = {
      start: this.service.getLocation(),
      app: app
    };

    this.launchNavigator.navigate(latitude + ', ' + longitude, options)
    .then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
    );
  }

  async ngOnInit() {
    // this.showTime = false;
    console.log('ngoninit');
    this.recommended = await this.service.getDataForPage();
    if(this.recommended === null) {
      // tslint:disable-next-line:no-unused-expression
      try {
        if (!this.platform.is('cordova')) { throw new Error; }
        this.recommended = this.storage.get('recommended')['__zone_symbol__value'];
        console.log(this.recommended);
      }catch(e) {
        this.router.navigateByUrl('');
      }
    }else {
      this.storage.set('recommended', this.recommended);
    }
  }

}
