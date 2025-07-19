import { Component, NgModule } from '@angular/core';
import { BudgetService } from '../../_services/budget.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget.html',
  styleUrl: './budget.css'
})
export class Budget {
  incomeItems: any[] = [];
  expenseItems: any[] = [];
  budget: any;
  inputType: 'inc' | 'exp' = 'inc';
  inputDescription = '';
  inputValue: number | null = null;

  constructor(private budgetService: BudgetService) {
    this.resetBudget();
  }

  ngOnInit() {
    this.budget = this.budgetService.getBudget();
  }

  // Function to add item when clicking or pressing Enter
  onAddItem() {
    if (this.inputDescription && this.inputValue !== null && this.inputValue > 0) {
      const newItem = this.budgetService.addItem(this.inputType, this.inputDescription, this.inputValue);
      if (this.inputType === 'inc') {
        this.incomeItems.push(newItem);
      } else {
        this.expenseItems.push(newItem);
      }
      this.updateBudget();
      this.clearFields();
    }
  }

  // Function to handle deletion of items
  onDeleteItem(type: 'inc' | 'exp', id: number) {
    this.budgetService.deleteItem(type, id);
    if (type === 'inc') {
      this.incomeItems = this.incomeItems.filter(item => item.id !== id);
    } else {
      this.expenseItems = this.expenseItems.filter(item => item.id !== id);
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
  private updateBudget() {
    this.budgetService.calculateBudget();
    this.budget = this.budgetService.getBudget();
  }

  // Function to clear input fields after adding an item
  private clearFields() {
    this.inputDescription = '';
    this.inputValue = null;
  }

  // Function to reset the budget to the initial state
  private resetBudget() {
    this.budget = {
      budget: 0,
      totalInc: 0,
      totalExp: 0,
      percentage: -1
    };
  }
}
