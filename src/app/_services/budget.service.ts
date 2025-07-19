import { Injectable } from '@angular/core';
import { BudgetItem } from '../_models/budgetItem';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private data = {
    allItems: {
      exp: [] as BudgetItem[],
      inc: [] as BudgetItem[]
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };
  addItem(type: 'exp' | 'inc', description: string, value: number): BudgetItem {
      let ID: number;
      if (this.data.allItems[type].length > 0) {
        ID = this.data.allItems[type][this.data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      const newItem: BudgetItem = {id: ID, description, value};
      this.data.allItems[type].push(newItem);
      return newItem;
  }

  deleteItem(type: 'exp' | 'inc', id: number) {
    const index = this.data.allItems[type].findIndex(item => item.id === id);
    if(index !== -1) {
      this.data.allItems[type].splice(index, 1);
    }
  }

   calculateBudget() {
    this.data.totals.inc = this.calculateTotal('inc');
    this.data.totals.exp = this.calculateTotal('exp');
    this.data.budget = this.data.totals.inc - this.data.totals.exp;
    if (this.data.totals.inc > 0) {
      this.data.percentage = Math.round((this.data.totals.exp / this.data.totals.inc) * 100);
    } else {
      this.data.percentage = -1;
    }
  }
  private calculateTotal(type: 'exp' | 'inc') {
    return this.data.allItems[type].reduce((sum, item) => sum + item.value, 0);
  }


  getBudget() {
    return {
      budget: this.data.budget,
      totalInc: this.data.totals.inc,
      totalExp: this.data.totals.exp,
      percentage: this.data.percentage
    }
  }
}
