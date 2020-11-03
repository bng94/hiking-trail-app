import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private geolocation: Geolocation,
              private service: DataService,
              private router: Router,
              private storage: Storage) {}

  onGroupClick(bool: boolean) {
    this.service.setParty(bool);
    this.storage.set('party', bool);
    this.router.navigateByUrl('/hikerinfos');
  }

  ngOnInit() {
    setTimeout(() => {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.service.setLocation(resp.coords.latitude, resp.coords.longitude);
        console.log('Latitude: ' + resp.coords.latitude + '\nLongitude: ' + resp.coords.longitude);
        this.service.getData().subscribe((data: any)=>{ console.log(data)});
        this.storage.set('Coordinates', resp.coords.latitude + ', ' + resp.coords.longitude);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }, 1000);
  }
}
