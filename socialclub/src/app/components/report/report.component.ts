import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
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
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.reportForm = this.fb.group({
      report_type: [null, Validators.required],
      description: ['', Validators.required]
    });
  }

  redirectToReportForm() {
    this.router.navigate(['/report']);
  }

  onSubmit() {
    if (this.reportForm.valid) {
      this.reportService.submitReport(this.reportForm.value)
        .subscribe(
          response => {
            console.log('Report submitted successfully:', response);
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
