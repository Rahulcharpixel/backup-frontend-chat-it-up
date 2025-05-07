import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';
import { quizStore } from 'src/app/store/quiz.store';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.page.html',
  styleUrls: ['./add-quiz.page.scss'],
})
export class AddQuizPage implements OnInit {
  quizId: string | null = null;
  predefinedSubcategories: string[] = [];
  quizForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private quizService: QuizService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      quizquestion: ['', Validators.required],
      questionType: ['mcq'],
      options: this.fb.array([]),
      subcategories: [[]],
    });
  }

  ngOnInit() {
    this.quizId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.quizId) {
      this.loadQuiz();
    }
    this.loadPredefinedSubcategories();
    this.initializeDefaultOptions();
  }

  initializeDefaultOptions() {
    while (this.options.length < 2) {
      this.options.push(this.fb.group({ option: ['', Validators.required] }));
    }
  }
  

  get options(): FormArray {
    return this.quizForm.get('options') as FormArray;
  }

 

  loadQuiz() {
    this.quizService.getQuizById(this.quizId!).subscribe((response) => {
      const quiz = response.quiz;
  
      this.quizForm.patchValue({
        title: quiz.title,
        quizquestion: quiz.quizquestion,
        questionType: quiz.questionType || 'mcq',
      });
  
      this.options.clear(); 
  
      if (quiz.questionType === 'mcq' && quiz.options.length > 0) {
        quiz.options.forEach((opt: { _id: string; option: string }) => {
          this.options.push(
            this.fb.group({
              _id: [opt._id], 
              option: [opt.option, Validators.required], 
            })
          );
        });
      }
  
     
      while (this.options.length < 2) {
        this.options.push(this.fb.group({ _id: [''], option: ['', Validators.required] }));
      }

      if (quiz.subcategories && quiz.subcategories.length > 0) {
              this.quizStore.currentQuiz = {
                ...quiz,
                subcategories: quiz.subcategories.map((sub:any) => sub.name || sub),
              };
            } else {
              this.quizStore.currentQuiz = { ...quiz, subcategories: [] };
            }
      quizStore.setCurrentQuiz(this.quizStore.currentQuiz);
    });
  }
  
  
  loadPredefinedSubcategories() {
    this.quizService.getPredefinedSubcategories().subscribe((response) => {
      this.predefinedSubcategories = response.subcategories;
      // console.log(this.predefinedSubcategories);
    });
  }

  
  addOption() {
    if (this.options.length >= 5) {
      alert('You can add a maximum of 5 options.');
      return;
    }
  
    this.options.push(this.fb.group({ _id: [''], option: ['', Validators.required] }));
  }
  
  removeOption(index: number) {
    if (this.options.length > 2) {
      this.options.removeAt(index);
    } else {
      alert('A quiz must have at least two options.');
    }
  }

  validateOptions(formArray: FormArray) {
    const optionsSet = new Set();
    for (let control of formArray.controls) {
      const value = control.value.trim().toLowerCase();
      if (optionsSet.has(value)) {
        return { duplicateOptions: true };
      }
      optionsSet.add(value);
    }
    return null;
  }

  get quizStore() {
    return quizStore;
  }
  onSubmit() {
    if (this.quizForm.invalid) return;
  
    const formData = this.quizForm.value;
    const formattedOptions = formData.options.map((opt: { option: string }) => ({
      option: opt.option.trim(),
    }));
  
    const quizData = {
      title: formData.title,
      quizquestion: formData.quizquestion,
      questionType: formData.questionType || 'mcq',
      subcategories: formData.subcategories.map((sub: string) => ({ name: sub })),
      options: formattedOptions,
    };
  
    if (this.quizId) {
      this.quizService.editQuiz(this.quizId, quizData).subscribe(
        () => {
          alert('Quiz updated successfully');
          this.router.navigate(['/quiz-list']);
        },
        (error) => {
          console.error('Error updating quiz:', error);
        }
      );
    } else {
      this.quizService.addQuiz(quizData).subscribe(
        (response) => {
          alert('Quiz created successfully');
          this.router.navigate(['/quiz-list']);
        },
        (error) => {
          console.error('Error creating quiz:', error);
        }
      );
    }
  }
  
  // onSubmit() {
  //   if (this.quizForm.invalid) return;
  
  //   const formData = this.quizForm.value;
  //   const formattedOptions = formData.options.map((opt: { _id: string; option: string }) => ({
  //     _id: opt._id ? opt._id : null, 
  //     option: opt.option.trim(),
  //   }));
  
  //   const quizData = {
  //     title: formData.title,
  //     quizquestion: formData.quizquestion,
  //     questionType: formData.questionType || 'mcq',
  //     subcategories: formData.subcategories.map((sub: string) => ({ name: sub })),
  //     options: formattedOptions, 
  //   };
  //   if (this.quizId) {
  //   this.quizService.editQuiz(this.quizId, quizData).subscribe(
  //     () => {
  //       alert('Quiz updated successfully');
  //       this.router.navigate(['/quiz-list']);
  //     },
  //     (error) => {
  //       console.error('Error updating quiz:', error);
  //     }
  //   );
  // }}
}
  
// addOption() {
  //   const optionValue = '';
  //   if (this.options.length >= 5) {
  //     alert('You can add a maximum of 5 options.');
  //     return;
  //   }

  //   const existingOptions = new Set(this.options.value.map((opt: string) => opt.trim().toLowerCase()));

  //   if (!existingOptions.has(optionValue.trim().toLowerCase())) {
  //     this.options.push(this.fb.control(optionValue, Validators.required));
  //   } else {
  //     alert('This option already exists.');
  //   }
  // }

 // loadQuiz() {
  //   this.quizService.getQuizById(this.quizId!).subscribe((response) => {
  //     const quiz = response.quiz;

  //     this.quizForm.patchValue({
  //       title: quiz.title,
  //       quizquestion: quiz.quizquestion,
  //       questionType: quiz.questionType || 'mcq',
  //     });

  //     this.options.clear();
  //     const uniqueOptions = new Set<string>();

  //     if (quiz.questionType === 'mcq' && quiz.options.length > 0) {
  //       quiz.options.forEach((opt: { option: string }) => {
  //         const trimmedOption = opt.option.trim().toLowerCase();
  //         if (!uniqueOptions.has(trimmedOption)) {
  //           uniqueOptions.add(trimmedOption);
  //           this.options.push(this.fb.control(opt.option, Validators.required));
  //         }
  //       });
  //     }

  //     while (this.options.length < 2) {
  //       this.options.push(this.fb.control('', Validators.required));
  //     }

  //     const formattedSubcategories = quiz.subcategories?.map((sub: any) =>
  //       typeof sub === 'string' ? sub : sub.name
  //     ) || [];

  //     this.quizForm.patchValue({
  //       subcategories: formattedSubcategories,
  //     });

  //     this.quizStore.currentQuiz = { ...quiz, subcategories: formattedSubcategories };

  //     quizStore.setCurrentQuiz(this.quizStore.currentQuiz);
  //   });
  // }

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { QuizService } from 'src/app/services/quiz.service';
// import { quizStore } from 'src/app/store/quiz.store';

// @Component({
//   selector: 'app-add-quiz',
//   templateUrl: './add-quiz.page.html',
//   styleUrls: ['./add-quiz.page.scss'],
// })
// export class AddQuizPage implements OnInit {
//   quizId: string | null = null;
//   predefinedSubcategories: string[] = [];
//   quizForm: FormGroup;

//   constructor(
//     private activatedRoute: ActivatedRoute,
//     private quizService: QuizService,
//     private router: Router,
//     private fb: FormBuilder
//   ) {
//     this.quizForm = this.fb.group({
//       title: ['', Validators.required],
//       quizquestion: ['', Validators.required],
//       questionType: ['mcq'],
//       options: this.fb.array([]),
//       subcategories: [[]],
//     });
//   }

//   ngOnInit() {
//     this.quizId = this.activatedRoute.snapshot.paramMap.get('id');
//     if (this.quizId) {
//       this.loadQuiz();
//     }
//     this.loadPredefinedSubcategories();
//     this.initializeDefaultOptions();
//   }

//   initializeDefaultOptions() {
//     if (this.options.length < 2) {
//       this.options.push(this.fb.control('', Validators.required));
//       this.options.push(this.fb.control('', Validators.required));
//     }
//   }

//   get options(): FormArray {
//     return this.quizForm.get('options') as FormArray;
//   }

  // loadQuiz() {
  //   this.quizService.getQuizById(this.quizId!).subscribe((response) => {
  //     const quiz = response.quiz;
  
  //     this.quizForm.patchValue({
  //       title: quiz.title,
  //       quizquestion: quiz.quizquestion,
  //     });
  

  //     this.options.clear();
  
  //     if (quiz.questionType === 'mcq' && quiz.options.length > 0) {
  //       quiz.options.forEach((opt: { option: string }) => {
  //         this.options.push(this.fb.control(opt.option, Validators.required));
  //       });
  //     }
  
  //     while (this.options.length < 2) {
  //       this.options.push(this.fb.control('', Validators.required));
  //     }
  
    
  //     if (quiz.subcategories && quiz.subcategories.length > 0) {
  //       this.quizStore.currentQuiz = {
  //         ...quiz,
  //         subcategories: quiz.subcategories.map((sub:any) => sub.name || sub),
  //       };
  //     } else {
  //       this.quizStore.currentQuiz = { ...quiz, subcategories: [] };
  //     }
  
  //     quizStore.setCurrentQuiz(quiz);
  //   });
  // }
  
//   loadPredefinedSubcategories() {
//     this.quizService.getPredefinedSubcategories().subscribe((response) => {
//       this.predefinedSubcategories = response.subcategories;
//     });
//   }

//   addOption() {
//     this.options.push(this.fb.control('', Validators.required));
//   }

//   removeOption(index: number) {
//     this.options.removeAt(index);
//   }

//   get quizStore() {
//     return quizStore;
//   }

//   onSubmit() {
//     if (this.quizForm.invalid) return;
  
//     const formData = this.quizForm.value;

//     const quizData = {
//       title: formData.title,
//       quizquestion: formData.quizquestion,
//       questionType: 'mcq',
//       subcategories: this.quizStore.currentQuiz?.subcategories?.map((sub) =>
//         typeof sub === 'string' ? { name: sub } : sub
//       ) || [],
//       options: formData.options.map((opt: string) => ({ option: opt.trim() })), 
//     };
  
 
//     if (this.quizId) {
//       this.quizService.editQuiz(this.quizId, quizData).subscribe(
//         () => {
//           alert('Quiz updated successfully');
//           this.router.navigate(['/quiz-list']);
//         },
//         (error) => {
//           console.error('Error updating quiz:', error);
//         }
//       );
//     } else {
//     this.quizService.addQuiz(quizData).subscribe(
//       (response) => {
//         console.log('Quiz added successfully', response);
//         alert('Quiz added successfully');
//         this.router.navigate(['/quiz-list']);
//       },
//       (error) => {
//         console.error('Error adding quiz:', error);
//       }
//     );
//   }
  
// }
// }
