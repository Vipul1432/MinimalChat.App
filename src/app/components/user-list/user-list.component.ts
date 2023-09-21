import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_shared/models/User';
import { UserService } from 'src/app/_shared/services/user.service';
import { NgToastService } from 'ng-angular-popup'; 

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit { 
  users: User[] = [];
  colors: string[] = ['#000000', '#e91e63', '#009688', '#ff9800', '#673ab7', '#ff5722'];
  constructor(private userService: UserService, private toasterService: NgToastService) {} 

  ngOnInit() {
    // Fetch all users
    this.userService.getAllUsers().subscribe(
      (response: any) => {
        console.log(response);
        if (response.statusCode === 200) {
          this.users = response.data; // Assign the users from the response
          this.toasterService.success({
            detail: "SUCCESS",
            summary: `Users fetched successfully`,
            duration: 5000
          });
        } else {
          this.toasterService.error({
            detail: "ERROR",
            summary: "Failed to fetch users",
            sticky: true
          });
        }
      },
      (error) => {
        console.error('Failed to fetch users:', error);
        this.toasterService.error({
          detail: "ERROR",
          summary: "Failed to fetch users",
          sticky: true
        });
      }
    );
  }
  generateRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }
}
