import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MailRecord } from '../../../core/models/models';
import { BureauOrderService } from '../services/bureau-order.service';

@Component({
    selector: 'app-bureau-order-page',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './bureau-order-page.component.html',
    styleUrl: './bureau-order-page.component.scss'
})
export class BureauOrderPageComponent implements OnInit {
  mails: MailRecord[] = [];
  private readonly fb = inject(FormBuilder);

  readonly searchControl = this.fb.nonNullable.control('');

  readonly form = this.fb.nonNullable.group({
    mailNumber: ['', Validators.required],
    subject: ['', Validators.required],
    senderName: ['', Validators.required],
    receiverSection: ['', Validators.required],
    direction: ['INCOMING' as const, Validators.required],
    status: ['REGISTERED' as const, Validators.required],
    urgent: [false]
  });

  constructor(private readonly bureauOrderService: BureauOrderService) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.bureauOrderService.getMails(this.searchControl.value).subscribe((rows) => (this.mails = rows));
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      REGISTERED: 'Enregistré', ASSIGNED: 'Assigné',
      IN_PROGRESS: 'En cours', CLOSED: 'Clôturé'
    };
    return map[status] || status;
  }

  createMail(): void {
    this.bureauOrderService.createMail(this.form.getRawValue()).subscribe(() => {
      this.form.patchValue({
        mailNumber: '', subject: '', senderName: '', receiverSection: '',
        direction: 'INCOMING', status: 'REGISTERED', urgent: false
      });
      this.search();
    });
  }
}
