import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FileUploadService } from "./file-upload.service";
import { QuestionUploadService } from './question-upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { fileExtensionValidator } from './file-extension-validator.directive';
import { HttpErrorResponse, HttpClient } from '@angular/common/http'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  preview: string;
  form: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  form4: FormGroup
  isUploaded =false;
  submitted = false;
  submitted2 = false;
  submitted3 = false;
  submitted4 = false;
  fileName: string = "No file selected";
  selectedFile: any;
  isVideoSelected: boolean;
  galleryImages: any;
  title = 'File upload';
  percentDone: any = 0;
  acceptedExtensions = "jpg,jpeg,gif,bmp,png,wav,mp3,mp4,flv,webm";
  fileExtError = false;
  fileSizeError = false;
  progress: number;
  result2: any = '';
  result3: any = '';
  result4: any = '';


  constructor(
    public fb: FormBuilder,
    public fileUploadService: FileUploadService,
    public questionUploadService: QuestionUploadService,
    public router: Router,
    public http: HttpClient
  ) {
    
  }

  
  ngOnInit() {
   

    this.form = this.fb.group({
      avatar: ['']
    });

    this.form2 = this.fb.group({
      input_val: ['',Validators.required]
    });

    this.form3 = this.fb.group({
      input_val: ['',Validators.required]
    });

    this.form4 = this.fb.group({
      input_val: [null,Validators.required]
    });

    this.getListingImages();

   }

   

   get formControl() {
    return this.form.controls;

  }

  uploadFile(event) {
    this.isUploaded = false;
    this.fileExtError = true;
    this.fileSizeError = true;
    console.log('fileTYpe',event.target.files[0].type);

    const maxFileSize = 10485760;
    const file = (event.target as HTMLInputElement).files[0];
    this.fileName = file['name'];
    this.selectedFile = file;
    const fileExt = file['name'].split('.').pop();
    const acceptFileExt = this.acceptedExtensions.split(',');

    
      console.log(acceptFileExt+'---'+ fileExt)
      if (acceptFileExt.includes(fileExt)) {
        this.fileExtError = false;
      }

      if(file['size'] <=  maxFileSize){
        this.fileSizeError = false;

      }
 
    console.log('fileExtError', this.fileExtError);
    console.log('fileSizeError', this.fileSizeError);

    if(!this.fileExtError && !this.fileSizeError){
      this.form.patchValue({
        avatar: file
      });
      this.form.get('avatar').updateValueAndValidity()
      // File Preview
      if(file.type.includes('image')){
        this.isVideoSelected = false;
        const reader = new FileReader();
        reader.onload = () => {
          this.preview = reader.result as string;
        }
        reader.readAsDataURL(file);
      }else{
        this.isVideoSelected = true;
      }
     
    }
  
  }
 
  submitForm() {
    this.submitted = true;
    this.progress = 0;
    console.log(this.selectedFile)
    if(this.selectedFile && !this.fileExtError && !this.fileSizeError){
      this.fileUploadService.uploadFile(
        this.form.value.avatar
      ).subscribe((event: HttpEvent<any>) => {
        console.log('eventresp', event)
        console.log('event', event)
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.percentDone = Math.round(event.loaded / event.total * 100);
            console.log(`Uploaded! ${this.percentDone}%`);
            break;
          case HttpEventType.Response:
            console.log('User successfully created!', event);
            this.isUploaded = true;
            this.preview = event.body.publicUrl;
            this.getListingImages();
            setTimeout(() => {
              this.percentDone = 0;
              this.isUploaded = false;
              this.preview = '';
              this.fileName = '';
              this.selectedFile = '';
              this.submitted = false;
              this.form.reset({
                avatar: '',
              });
            }, 5000);
        }
      });
    }
  }

  submitForm2() {
    this.submitted2 = true;
    this.result2 = '';
    if(this.form2.value.input_val){  
        this.http.get<any>('http://localhost:3000/fibonacci/'+this.form2.value.input_val).subscribe(res => {
    this.result2 = res;
      this.submitted2 = false;
    this.form2.reset({
      input_val: '',
    });
    })       
  }
   }

   submitForm3() {
    this.submitted3 = true;
    this.result3 = '';
    if(this.form3.value.input_val){
    const headers = { 'content-type': 'application/json'}  
    const objData=JSON.stringify({balancedstring: this.form3.value.input_val});
    this.http.post<any>('http://localhost:3000/balanced-substrings/',objData,{'headers':headers}).subscribe(res => {
    this.result3 = res.result;
    this.submitted3 = false;
    this.form3.reset({
      input_val: '',
    });
      console.log(res.result);
    })       
  }
   }

   submitForm4() {
    this.submitted4 = true;
    this.result4 = '';
    if(this.form4.value.input_val){
      this.http.get<any>('http://localhost:3000/migrateRings/'+this.form4.value.input_val+'/A/B/C/').subscribe(res => {
        this.result4 = res;
        this.submitted4 = false;

        this.form4.reset({
          input_val: '',
        });
        })           
    }
    
   }

   getListingImages() {
        this.http.get<[]>('http://localhost:3000/list-images/').subscribe(res => {
      console.log(res);

      this.galleryImages = res;
    });    
   }
  
}