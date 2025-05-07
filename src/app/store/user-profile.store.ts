// import { Injectable } from '@angular/core';
// import { action, observable } from 'mobx-angular';
// import { UserProfileService } from '../services/user-profile.service';
// import { makeObservable, runInAction } from 'mobx';
// import { jwtDecode } from 'jwt-decode';

// @Injectable({
//     providedIn: 'root',
// })
// export class UserProfileStore {
//     @observable userProfile: any = null;
//     @observable loading: boolean = false;
//     @observable error: string | null = null;

//     constructor(private userProfileService: UserProfileService) {
//         makeObservable(this);
//     }

//     public getUserIdFromToken(): string | null {
//         const token = localStorage.getItem('authToken');
//         if (token) {
//             const decodedToken: any = jwtDecode(token);
//             return decodedToken.id;
//         }
//         return null;
//     }
//     @action
//     async loadUserProfile() {
//         this.loading = true;
//         this.error = null;
//         const userId = this.getUserIdFromToken();
//         if (!userId) {
//             this.error = 'User ID not found in token';
//             this.loading = false;
//             return;
//         }
//         try {
//             const data = await this.userProfileService.getUserProfile(userId).toPromise();
//             runInAction(() => {
//                 this.userProfile = data;
//                 this.loading = false;
//             });
//         } catch (error) {
//             runInAction(() => {
//                 this.error = 'Error loading user profile';
//                 this.loading = false;
//             });
//         }
//     }

//     @action
//     async updateUserProfile(updatedData: any) {
//         this.loading = true;
//         this.error = null;
//         const userId = this.getUserIdFromToken();
//         if (!userId) {
//             this.error = 'User ID not found in token';
//             this.loading = false;
//             return;
//         }
//         try {
//             const response = await this.userProfileService.updateUserProfile(userId, updatedData).toPromise();
//             if (response) {
//                 runInAction(() => {
//                     this.userProfile = response.user;
//                     this.loading = false;
//                 });
//                 return response.message;
//             } else {
//                 throw new Error('No response from server');
//             }
//         } catch (error) {
//             runInAction(() => {
//                 this.error = 'Error updating user profile';
//                 this.loading = false;
//             });
//             throw error;
//         }
//     }
// }

import { Injectable } from '@angular/core';
import { action, observable } from 'mobx-angular';
import { UserProfileService } from '../services/user-profile.service';
import { makeObservable, runInAction } from 'mobx';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class UserProfileStore {
    @observable userProfile: any = null;
    @observable loading: boolean = false;
    @observable error: string | null = null;

    constructor(private userProfileService: UserProfileService) {
        makeObservable(this);
    }

    public getUserIdFromToken(): string | null {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedToken: any = jwtDecode(token);
            return decodedToken.id;
        }
        return null;
    }
    
    @action
    async loadUserProfile() {
        this.loading = true;
        this.error = null;
        const userId = this.getUserIdFromToken();
        if (!userId) {
            this.error = 'User ID not found in token';
            this.loading = false;
            return;
        }
        try {
            const data = await this.userProfileService.getUserProfile(userId).toPromise();
            runInAction(() => {
                this.userProfile = {
                    ...data,
                    countryCode: data?.countryCode || '+91', 
                };
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = 'Error loading user profile';
                this.loading = false;
            });
        }
    }

    @action
    async updateUserProfile(updatedData: any) {
        this.loading = true;
        this.error = null;
        const userId = this.getUserIdFromToken();
        if (!userId) {
            this.error = 'User ID not found in token';
            this.loading = false;
            return;
        }
        try {
            const response = await this.userProfileService.updateUserProfile(userId, updatedData).toPromise();
            if (response) {
                runInAction(() => {
                    this.userProfile = { 
                        ...response.user, 
                        countryCode: updatedData.countryCode, 
                        mobile: updatedData.mobile 
                    };
                    this.loading = false;
                });
                return response.message;
            } else {
                throw new Error('No response from server');
            }
        } catch (error) {
            runInAction(() => {
                this.error = 'Error updating user profile';
                this.loading = false;
            });
            throw error;
        }
    }
}
