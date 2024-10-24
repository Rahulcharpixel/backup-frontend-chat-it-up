import { makeAutoObservable } from 'mobx';

interface DropdownOption {
  option: string;
}

interface Subcategory {
  name: string;
  dropdownOptions: DropdownOption[];
}

interface Quiz {
  _id?: string;
  title: string;
  subcategories: Subcategory[];
  quizquestion?: string;
  smallTestAnswer?: string;
}

class QuizStore {
  quizzes: Quiz[] = [];
  currentQuiz: Quiz = {
    title: '',
    subcategories: [{ name: '', dropdownOptions: [{ option: '' }] }],
    quizquestion: '',
    smallTestAnswer: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  setQuizzes(quizzes: Quiz[]) {
    this.quizzes = quizzes;
  }

  setCurrentQuiz(quiz: Quiz) {
    this.currentQuiz = quiz;
  }

  clearCurrentQuiz() {
    this.currentQuiz = {
      title: '',
      subcategories: [{ name: '', dropdownOptions: [{ option: '' }] }],
      quizquestion: '',
      smallTestAnswer: '',
    };
  }

  updateCurrentQuizField(key: keyof Quiz, value: any) {
    if (key === 'title' || key === 'quizquestion' || key === 'smallTestAnswer') {
      this.currentQuiz[key] = value;
    } else if (key === 'subcategories') {
      this.currentQuiz.subcategories = value;
    }
  }

  updateQuizInStore(updatedQuiz: Quiz) {
    this.quizzes = this.quizzes.map(quiz =>
      quiz._id === updatedQuiz._id ? updatedQuiz : quiz
    );
  }
}

const quizStore = new QuizStore();
export { quizStore };
