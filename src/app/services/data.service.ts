import { HTTP } from '@ionic-native/http/ngx';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HikerInfo } from '../interfaces/hikerinfo';
import { RecommendHikeTrail } from '../interfaces/recommendhiketrail';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  latitude: number;
  longitude: number;
  distance: number;
  hikerInfo: HikerInfo;
  party: boolean;
  // duration: any;
  recommendHikeTrail: RecommendHikeTrail[];
  constructor(private nativeHttp: HTTP, private http: HttpClient,
              private router: Router) {
                this.hikerInfo = {
                  hikers: 0,
                  skillLevel: '',
                  travelTime: ''
                };
                this.recommendHikeTrail = [{
                  trailName: '',
                  trailLocation: '',
                  trailImg: '',
                  trailURL: '',
                  trailLatitude: 0,
                  trailLongitude: 0
                }];
  }

  getParty() {
    return this.party;
  }

  setParty(live: boolean) {
    this.party = live;
  }

  setLocation(lat: number, long: number) {
    this.latitude = lat;
    this.longitude = long;
  }

  getLocation() {
    return this.latitude + ',' + this.longitude;
  }
  //refresher check data, and reset if necessary
  getLatitudeIsNaN() {
    return isNaN(this.latitude);
  }
  getLongitudeIsNaN() {
    return isNaN(this.longitude);
  }

  setFormData(group: number, skill: string, length: string) {
    this.hikerInfo.hikers = group;
    this.hikerInfo.skillLevel = skill;
    this.hikerInfo.travelTime = length;
  }
  getFormData() {
    return  [this.hikerInfo.hikers, this.hikerInfo.skillLevel, this.hikerInfo.travelTime];
  }
  
  getData() {
    if (this.hikerInfo.travelTime === 'one') {
      this.distance = 50;
    } else if (this.hikerInfo.travelTime === 'two') {
      this.distance = 100;
    } else if (this.hikerInfo.travelTime === 'three') {
      this.distance = 150;
    } else {
      this.distance = 200;
    }
    console.log(this.distance);
    console.log('site: ' + `https://www.hikingproject.com/data/get-trails?lat=${this.latitude}&lon=${this.longitude}&maxDistance=${this.distance}&key=HIKINGTRIALAPIKEY`);
    return this.http
    // tslint:disable-next-line:max-line-length
   .get(`https://www.hikingproject.com/data/get-trails?lat=${this.latitude}&lon=${this.longitude}&maxDistance=${this.distance}&key=HIKINGTRIALAPIKEY`);
  }

  sortCompareAscent(a: any, b: any) {
    if (a.ascent < b.ascent) { return -1; }
    if (a.ascent > b.ascent) { return 1; }
  }

  sortByTrailName(a: any, b: any) {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
  }

  getFilteredBeginnerData() {
    return this.getData().pipe(
      map((data: any) => {
        console.log('Setting up: ');
        const greenTrail =  data.trails.filter((data: any) => {
            return data.difficulty === 'green';
          });
        const blueTrailWithAscent = data.trails.filter((data: any) => {
          return data.difficulty === 'blue' && data.ascent <= 500;
        });
        let blueTrail: any;
        if (Object.keys(blueTrailWithAscent).length < 1) {
          blueTrail = data.trails.filter((data: any) => {
            return data.difficulty === 'blue';
          }).sort(this.sortCompareAscent).splice(5);
        } else {
          blueTrail = blueTrailWithAscent;
        }

        if(Object.keys(blueTrail).length < 1) {
          blueTrail = data.trails;
        }

        const beginnerData = Object.keys(greenTrail).length <= 1 ? { ...greenTrail, ...blueTrail} : greenTrail ;

        console.log('Data :');
        console.log(beginnerData);
        return beginnerData;
      }));
  }

  getFilteredIntermediateData() {
    return this.getData().pipe(
      map((data: any) => {
        console.log('Setting up: ');
        const blueTrail =  data.trails.filter((data: any) => {
            return data.difficulty === 'blue';
          });
        const blackTrailWithAscent = data.trails.filter((data: any) => {
          return data.difficulty === 'black' && data.ascent <= 600;
        });
        let blackTrail: any;
        if (Object.keys(blackTrailWithAscent).length < 1) {
          blackTrail = data.trails.filter((data: any) => {
            return data.difficulty === 'black';
          }).sort(this.sortCompareAscent).splice(5);
        } else {
          blackTrail = blackTrailWithAscent;
        }

        const intermediateData = Object.keys(blueTrail).length <= 1 ? { ...blueTrail, ...blackTrail} : blueTrail;
        console.log('Data :');
        console.log(intermediateData);
        return intermediateData;
      }));
  }

  getFilteredAdvanceData() {
    return this.getData().pipe(
      map((data: any) => {
        console.log('Setting up: ');
        const blackTrail = data.trails.filter((data: any) => {
          return data.difficulty === 'black';
        });
        const blueTrail =  data.trails.filter((data: any) => {
          return data.difficulty === 'blue';
        }).sort(this.sortCompareAscent).splice(5);
        const advData = Object.keys(blackTrail).length < 1 ? { ...blackTrail, ...blueTrail} : blackTrail;
        console.log('Data :');
        console.log(advData);
        return advData;
      }));
  }

  getDataForPage() {
    let data: any;
    if (this.hikerInfo.skillLevel === 'beginner') {
      console.log('in beginner');
      data = this.getFilteredBeginnerData();
    } else if (this.hikerInfo.skillLevel === 'intermediate') {
      console.log('in intermediate');
      data = this.getFilteredIntermediateData();
    } else if (this.hikerInfo.skillLevel === 'advance') {
      console.log('in advance');
      data =  this.getFilteredAdvanceData();
    } else {
      console.log('in none...?');
      return null;
      // this.router.navigateByUrl('');
    }

    data.subscribe((trail: any) => {
      console.log('What is trail?');
      console.log(trail);
      console.log(trail.length);
      console.log( Object.keys(trail).length);
      const length = trail.length === undefined ? Object.keys(trail).length : trail.length;
      for (let i = 0; i < length; i++) {
        console.log('in subscribe getDataForPage:');
        // tslint:disable-next-line:max-line-length
        // console.log( trail[i].name + '' + trail[i].location + '' + trail[i].imgMedium +'' + trail[i].url + '' + trail[i].latitude + '' + trail[i].longitude);

        this.recommendHikeTrail[i] = {
          trailName: trail[i].name,
          trailLocation: trail[i].location,
          trailImg: trail[i].imgMedium,
          trailURL: trail[i].url,
          trailLatitude: trail[i].latitude,
          trailLongitude: trail[i].longitude
        };

        console.log(this.recommendHikeTrail[i]);
      }
    });
    console.log('for loop done?');
    return this.recommendHikeTrail;
  }

  getRecommendHikeTrail(){
    return this.recommendHikeTrail;
  }

  // getDuration(lat: number, long: number) {
  //   // tslint:disable-next-line:max-line-length
  //   console.log(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${this.latitude},${this.longitude}&destinations=${lat},${long}&key=GOOGLEAPIKEY`);
  //   // tslint:disable-next-line:max-line-length
  //   let nativeCall = this.nativeHttp.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${this.latitude},${this.longitude}&destinations=${lat},${long}&key=GOOGLEAPIKEY`, {},
  //   { 'Content-type': 'application/json'});

  //   from(nativeCall).subscribe((data: any) => {
  //     this.duration = data; }) ;

  //   return this.duration;
  //   return this.http.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${this.latitude},${this.longitude}&destinations=${lat},${long}&key=GOOGLEAPIKEY`)
  //                   .subscribe((data: any) => {
  //                       console.log(data);
  //                       return data.rows.elements.duration.text;
  //                     });
  //                   .pipe(map((data: any) => {
  //                     console.log(data);
  //                      return data.rows.elements.duration.text;
  //                     }));
  // }
}
