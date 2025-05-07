 

import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QuizService } from 'src/app/services/quiz.service';
import { quizStore } from 'src/app/store/quiz.store';

@Component({
  selector: 'app-filter-component',
  templateUrl: './filter-component.component.html',
  styleUrls: ['./filter-component.component.scss'],
})
export class FilterComponentComponent implements OnInit {
  @Input() onFilterApplied!: () => void;
  predefinedSubcategories: string[] = [];
  selectedFilters: { type?: string; subcategory?: string } = {}; 

  filterTypes = [
    { label: 'Answered Quizzes', value: 'answered' },
    { label: 'Unanswered Quizzes', value: 'unanswered' },
    { label: 'My Quizzes', value: 'myQuizzes' },
  ];

  constructor(
    private modalController: ModalController,
    private quizService: QuizService
  ) {}

  ngOnInit() {
    this.loadPredefinedSubcategories();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  toggleFilter(filterType: 'type' | 'subcategory', value: string) {
    if (this.selectedFilters[filterType] === value) {
      this.selectedFilters[filterType] = undefined;
    } else {
      this.selectedFilters[filterType] = value;
    }
  }

  submitFilters() {
    const type = this.selectedFilters.type ?? "";
    const subcategory = this.selectedFilters.subcategory ?? "";
  
    this.quizService.getFilteredQuizzes(type, subcategory).subscribe((response) => {
      quizStore.setAllQuizzes(response?.quizzes || []);
      this.onFilterApplied();
      this.dismiss();
    });
  }
  

  resetFilters() {
    this.selectedFilters = {}; 
    this.quizService.getFilteredQuizzes().subscribe((response) => {
      quizStore.setAllQuizzes(response?.quizzes || []);  
    });
  }
  

  loadPredefinedSubcategories() {
    this.quizService.getPredefinedSubcategories().subscribe((response) => {
      this.predefinedSubcategories = response.subcategories;
    });
  }

  get quizStore() {
    return quizStore;
  }
}