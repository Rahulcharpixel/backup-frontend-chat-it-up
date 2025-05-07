
// import { makeAutoObservable } from 'mobx';

// interface Subcategory {
//   name: string;
// }
// interface Quiz {
//   _id?: string;
//   title: string;
//   subcategories: Subcategory[];
//   quizquestion?: string;
//   questionType?: string;
//   options?: string[];
//   userId?: string;
// }

// class QuizStore {
//   allQuizzes: Quiz[] = [];
//   myQuizzes: Quiz[] = [];
//   originalAllQuizzes: Quiz[] = [];
//   originalMyQuizzes: Quiz[] = [];
//   currentQuiz: Quiz = {
//     title: '',
//     subcategories: [{ name: '' }],
//     quizquestion: '',
//     questionType: '',
//     options: [],
//   };

//   constructor() {
//     makeAutoObservable(this);
//   }

//   setAllQuizzes(quizzes: Quiz[]) {
//     this.allQuizzes = quizzes;
//     if (this.originalAllQuizzes.length === 0) {
//       this.originalAllQuizzes = [...quizzes];
//     }
//   }

//   setMyQuizzes(quizzes: Quiz[]) {
//     this.myQuizzes = quizzes;
//     if (this.originalMyQuizzes.length === 0) {
//       this.originalMyQuizzes = [...quizzes];
//     }
//   }

//   setCurrentQuiz(quiz: Quiz) {
//     this.currentQuiz = quiz;
//   }

//   resetAllQuizzes() {
//     this.allQuizzes = [...this.originalAllQuizzes];
//   }

//   resetMyQuizzes() {
//     this.myQuizzes = [...this.originalMyQuizzes];
//   }

//   clearCurrentQuiz() {
//     this.currentQuiz = {
//       title: '',
//       subcategories: [{ name: '' }],
//       quizquestion: '',
//       questionType: '',
//       options: [],
//     };
//   }

//   updateCurrentQuizField(key: keyof Quiz, value: any) {
//     if (key === 'title' || key === 'quizquestion') {
//       this.currentQuiz[key] = value;
//     } else if (key === 'subcategories') {
//       this.currentQuiz.subcategories = value;
//     }
//   }

//   updateMyQuizInStore(updatedQuiz: Quiz) {
//     this.myQuizzes = this.myQuizzes.map(quiz =>
//       quiz._id === updatedQuiz._id ? updatedQuiz : quiz
//     );
//   }

//   updateAllQuizInStore(updatedQuiz: Quiz) {
//     this.allQuizzes = this.allQuizzes.map(quiz =>
//       quiz._id === updatedQuiz._id ? updatedQuiz : quiz
//     );
//   }

//   removeQuizFromAllQuizzes(id: string) {
//     this.allQuizzes = this.allQuizzes.filter(quiz => quiz._id !== id);
//   }

//   removeQuizFromMyQuizzes(id: string) {
//     this.myQuizzes = this.myQuizzes.filter(quiz => quiz._id !== id);
//   }
// }

// const quizStore = new QuizStore();
// export { quizStore };



import { makeAutoObservable } from 'mobx';

interface Subcategory {
  name: string;
}
interface Quiz {
  _id?: string;
  title: string;
  subcategories: Subcategory[];
  quizquestion?: string;
  questionType?: string;
  options?: string[];
  userId?: string;
  answered?: boolean; 
}

class QuizStore {
  allQuizzes: Quiz[] = [];
  myQuizzes: Quiz[] = [];
  originalAllQuizzes: Quiz[] = [];
  originalMyQuizzes: Quiz[] = [];
  currentQuiz: Quiz = {
    title: '',
    subcategories: [{ name: '' }],
    quizquestion: '',
    questionType: '',
    options: [],
  };
  selectedFilter: string = 'all'; 
  filteredQuizzes: Quiz[] = []; 

  constructor() {
    makeAutoObservable(this);
  }

  setAllQuizzes(quizzes: Quiz[]) {
    this.allQuizzes = quizzes;
    if (this.originalAllQuizzes.length === 0) {
      this.originalAllQuizzes = [...quizzes];
    }
    this.filterQuizzes(); 
  }

  setMyQuizzes(quizzes: Quiz[]) {
    this.myQuizzes = quizzes;
    if (this.originalMyQuizzes.length === 0) {
      this.originalMyQuizzes = [...quizzes];
    }
    this.filterQuizzes(); 
  }

  setCurrentQuiz(quiz: Quiz) {
    this.currentQuiz = quiz;
  }

  resetAllQuizzes() {
    this.allQuizzes = [...this.originalAllQuizzes];
  }

  resetMyQuizzes() {
    this.myQuizzes = [...this.originalMyQuizzes];
  }

  clearCurrentQuiz() {
    this.currentQuiz = {
      title: '',
      subcategories: [{ name: '' }],
      quizquestion: '',
      questionType: '',
      options: [],
    };
  }

  updateCurrentQuizField(key: keyof Quiz, value: any) {
    if (key === 'title' || key === 'quizquestion') {
      this.currentQuiz[key] = value;
    } else if (key === 'subcategories') {
      this.currentQuiz.subcategories = value;
    }
  }

  updateAllQuizInStore(updatedQuiz: Quiz) {
    this.allQuizzes = [...this.allQuizzes.map(quiz =>
      quiz._id === updatedQuiz._id ? updatedQuiz : quiz
    )];
  }
  
  updateMyQuizInStore(updatedQuiz: Quiz) {
    this.myQuizzes = [...this.myQuizzes.map(quiz =>
      quiz._id === updatedQuiz._id ? updatedQuiz : quiz
    )];
  }
  

  removeQuizFromAllQuizzes(id: string) {
    this.allQuizzes = this.allQuizzes.filter(quiz => quiz._id !== id);
  }

  removeQuizFromMyQuizzes(id: string) {
    this.myQuizzes = this.myQuizzes.filter(quiz => quiz._id !== id);
  }


  setSelectedFilter(filter: string) {
    this.selectedFilter = filter;
    this.filterQuizzes(); 
  }


  filterQuizzes() {
    switch (this.selectedFilter) {
      case 'my-quizzes':
        this.filteredQuizzes = this.myQuizzes;
        break;
      case 'answered':
        this.filteredQuizzes = this.allQuizzes.filter(quiz => quiz.answered);
        break;
      case 'unanswered':
        this.filteredQuizzes = this.allQuizzes.filter(quiz => !quiz.answered);
        break;
      case 'subcategory':
        this.filteredQuizzes = this.allQuizzes.filter(quiz => quiz.subcategories.length > 0);
        break;
      default:
        this.filteredQuizzes = [...this.allQuizzes]; 
        break;
    }
  }
}

const quizStore = new QuizStore();
export { quizStore };
