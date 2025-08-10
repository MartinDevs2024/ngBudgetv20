import { Component, effect, signal } from '@angular/core';
import { BudgetService } from '../../_services/budget.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { BudgetItem } from '../../_models/budgetItem';

@Component({
  selector: 'app-budget',
  imports: [CommonModule, FormsModule],
  templateUrl: './budget.html',
  styleUrl: './budget.css'
})
export class Budget {
   inputType: 'inc' | 'exp' = 'inc';
  inputDescription = '';
  inputValue: number | null = null;


  // Strongly typed signals
  incomeItems = signal<BudgetItem[]>([]);
  expenseItems = signal<BudgetItem[]>([]);
  budget = signal({
    budget: 0,
    totalInc: 0,
    totalExp: 0,
    percentage: -1
  });
  constructor(private budgetService: BudgetService) {
    //Initialize the budget and items with signals
    this.budget.set(this.budgetService.getBudget());

    //Effect will auto-run
    effect(() => {
       //Recalculate budget when income or expense items change
       const _ = [this.incomeItems(), this.expenseItems()];
       this.budgetService.calculateBudget();
       this.budget.set(this.budgetService.getBudget());
    });
  }



  // Function to add item when clicking or pressing Enter
  onAddItem() {
    if (this.inputDescription && this.inputValue !== null && this.inputValue > 0) {
      const newItem = this.budgetService.addItem(this.inputType, this.inputDescription, this.inputValue);
      if (this.inputType === 'inc') {
        this.incomeItems.update(items => [...items, newItem]);
      } else {
        this.expenseItems.update(items => [...items, newItem]);
      }
      this.updateBudget();
      this.clearFields();
    }
  }

  // Function to handle deletion of items
  onDeleteItem(type: 'inc' | 'exp', id: number) {
    this.budgetService.deleteItem(type, id);
    if (type === 'inc') {
      this.incomeItems.update(items => items.filter(item => item.id !== id));
    } else {
      this.expenseItems.update(items => items.filter(item => item.id !== id));
    }
    this.updateBudget();
  }

  // Function to detect the Enter key press
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onAddItem();
    }
  }

  // Function to update the budget after item changes
  updateBudget() {
    this.budgetService.calculateBudget();
    this.budget.set(this.budgetService.getBudget());
  }

  // Function to clear input fields after adding an item
  private clearFields() {
    this.inputDescription = '';
    this.inputValue = null;
  }

  // Function to reset the budget to the initial state
  resetBudget() {
    this.incomeItems.set([]);
    this.expenseItems.set([]);
    this.budget.set({
      budget: 0,
      totalInc: 0,
      totalExp: 0,
      percentage: -1
    });
  }
}


