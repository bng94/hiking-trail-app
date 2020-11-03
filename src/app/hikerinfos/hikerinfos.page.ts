import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hikerinfos',
  templateUrl: './hikerinfos.page.html',
  styleUrls: ['./hikerinfos.page.scss'],
})
export class HikerinfosPage implements OnInit {
  hikersInfo = { party: '', skill: '', time: ''};
  pageTitle = 'Hikers Info Form';
  partyOrNot: boolean;
  constructor(public alertController: AlertController,
              private service: DataService,
              private router: Router) {
                this.partyOrNot = this.service.getParty();

                if(!this.partyOrNot) {
                  this.hikersInfo.party = '1';
                  this.pageTitle = 'Hiker Info Form';
                }else{
                  this.hikersInfo.party = '';
                }
              }
  doRefresh(event) {
    console.log('Begin async operation');
    if (this.isHikersInfoEmpty(this.hikersInfo)) {
      setTimeout(()=>{
        this.openAlert('Make sure to fill out the fields!');
      }, 3000);
    } else {
      let array;
      array = this.service.getFormData();

      if (this.isHikersInfoEmpty(array) || array[0] !== Number(this.hikersInfo.party) || array[1] !== this.hikersInfo.skill || array[2] !== this.hikersInfo.time){
          this.openAlert('The values has not been submitted! Please click submit button when you are ready!');
      }
    }
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  onSubmit() {
    if (this.isHikersInfoEmpty(this.hikersInfo)) {
      return this.openAlert('You can submit empty data!');
    } else {
      console.log('size is' + this.hikersInfo.party);
      console.log('skill is' + this.hikersInfo.skill);
      console.log('time is' + this.hikersInfo.time);
      this.service.setFormData(Number(this.hikersInfo.party), this.hikersInfo.skill, this.hikersInfo.time);

      this.router.navigateByUrl('/recommendation');
    }
  }

  async openAlert(msg: string) {
    if(msg === '') {
      msg = 'You can\'t leave any field blank!';
    }
    const alert = await this.alertController.create({
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  isHikersInfoEmpty(array) {
    if ((array.party === '0' || array.party === '-1') || array.skill === '' || array.time === '' ) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit() {

  }

}
