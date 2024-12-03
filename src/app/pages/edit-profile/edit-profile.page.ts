import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { UserProfileStore } from 'src/app/store/user-profile.store';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  editProfileForm: FormGroup;
  selectedImage: File | null = null;
  imageUrl: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingController: LoadingController,
    public userProfileStore: UserProfileStore
  ) {
    this.editProfileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    await this.userProfileStore.loadUserProfile();
    const { userProfile } = this.userProfileStore;
    if (userProfile) {
      this.editProfileForm.setValue({
        name: userProfile.name,
        email: userProfile.email,
        mobile: userProfile.mobile,
      });
    }
  }

  async updateProfile() {
    if (this.editProfileForm.valid) {
      const loading = await this.loadingController.create({
        spinner: 'circles',
        duration: 5000,
      });
      await loading.present();

      try {
        await this.userProfileStore.updateUserProfile(this.editProfileForm.value);
        await loading.dismiss();
        alert('Profile updated successfully!');
        this.router.navigate(['/settings']);
      } catch (error) {
        await loading.dismiss();
        alert('Failed to update profile.');
      }
    }
  }
}
