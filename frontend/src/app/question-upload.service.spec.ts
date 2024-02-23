import { TestBed } from '@angular/core/testing';

import { QuestionUploadService } from './question-upload.service';

describe('QuestionUploadService', () => {
  let service: QuestionUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
