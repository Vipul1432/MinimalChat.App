import { Component, OnInit, ViewChild } from '@angular/core';
import { Log } from '../../_shared/models/Log';
import { ChatService } from 'src/app/_shared/services/chat.service';
import { NgToastService } from 'ng-angular-popup';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.css']
})
export class LogListComponent implements OnInit {
  logs: Log[] = [];
  startTime: Date | null = null;
  endTime: Date | null = null;
  selectedTimeframe: string = '5';
  theme = 'theme-default';
  disableStart = false;
  disableEnd = false;
  dataSource = new MatTableDataSource(this.logs);
  displayedColumns: string[] =  ['id','ipAddress', 'requestTimestamp', 'username', 'requestBody'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = 10;

  constructor(private chatService: ChatService, private toasterService: NgToastService) { }

  ngOnInit(): void {
    this.fetchLogs();
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.fetchLogs();
  }

  fetchLogs(): void {
    this.chatService.fetchLogs(this.startTime, this.endTime)
      .subscribe(
        (response: any) => {
          this.logs = response.data;
          console.log(this.logs);
          
          this.dataSource = new MatTableDataSource(this.logs); 
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.toasterService.success({ detail: "SUCCESS", summary: 'Logs retrieve successfully!', duration: 5000 });
        },
        (error) => {
          if (error.status === 404) {
            this.toasterService.warning({ detail: "WARN", summary: 'No log found in this time', duration: 5000, position: 'bottomRight' });
            console.log(error.error.message);
          }
          console.error('An error occurred while fetching logs:', error.error.statusCode);
        }
      );
  }

  onTimeframeChange(): void {
    if (this.selectedTimeframe === 'custom' && this.startTime !== null && this.endTime !== null) {

      console.log('Custom Start Time:', this.startTime);
      console.log('Custom End Time:', this.endTime);
    } else if (this.selectedTimeframe != 'custom') {
      // Calculate startTime and endTime based on the selected timeframe
      const now = new Date();
      this.endTime = now;
      this.startTime = new Date(now.getTime() - (+this.selectedTimeframe * 60 * 1000));
    }
    this.fetchLogs();
  }

  private formatTime(time: string | null): Date | null {
    if (time === null || typeof time !== 'string') {
      return null;
    }

    const match = time.match(/(\d+):(\d+) ([APM]+)$/);
    if (!match) {
      return null;
    }

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
      return null; // Invalid hour/minute values
    }

    if (ampm !== 'AM' && ampm !== 'PM') {
      return null; // Invalid AM/PM indicator
    }

    // Adjust hours for PM if needed
    if (ampm === 'PM' && hours !== 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }

    const currentDate = new Date();
    const parsedTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hours,
      minutes,
      0,
      0
    );

    return parsedTime;
  }

  setCustomTimes(): void {
    this.startTime = this.formatTime(this.startTime!.toString());
    this.endTime = this.formatTime(this.endTime!.toString());
    this.fetchLogs();
  }
}
