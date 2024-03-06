import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  postId: number;
  userId: number;
  reportForm!: FormGroup;
  reportTypes: { value: string, label: string }[] = [
    { value: 'spam', label: 'Spam' },
    { value: 'scam', label: 'Scam or Fraud' },
    { value: 'hate_speech', label: 'Hate Speech or Symbols' },
    { value: 'false_information', label: 'False Information' },
    { value: 'violence', label: 'Violence or Dangerous Organizations' },
    { value: 'intellectual_property', label: 'Intellectual Property Violation' },
    { value: 'illegal_goods', label: 'Sale of Illegal or Regulated Goods' },
    { value: 'suicide_self_injury', label: 'Suicide or Self-Injury' },
    { value: 'eating_disorders', label: 'Eating Disorders' },
    { value: 'other', label: 'Something Else' }
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private reportService: ReportService,
    private route: ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = Number(params['id']);
      // this.postId = params['id']; // This will give you the value of the id parameter from the URL
      console.log(this.postId, 'post'); // For example, you can log it to the console
    });

    const data = sessionStorage.getItem('userId');
    console.log('data',data)
    this.userId = JSON.parse(data);
    console.log(this.userId, 'user');

    this.initializeForm();

  }

  initializeForm() {
    this.reportForm = this.fb.group({
      user: this.userId,
      post_id: this.postId,
      report_type: [null, Validators.required],
      description: ['', Validators.required]
    });
  }
  //userId
  redirectToReportForm() {
    this.router.navigate(['/home']);
  }

  onSubmit() {
    if (this.reportForm.valid) {
      console.log(this.reportForm.value, 'this.reportForm.value')
      this.reportService.submitReport(this.reportForm.value)
        .subscribe(
          response => {
            console.log('Report submitted successfully:', response);
            this.router.navigate(['/home']);
            // Reset form or handle success as needed
          },
          error => {
            console.error('Error submitting report:', error);
            // Handle error or provide user feedback
          }
        );
    }
  }
}
