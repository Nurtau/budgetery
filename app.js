var BudgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expense.prototype.calcPercentage = function (income) {
    if (income > 0) {
      this.percentage = Math.round((this.value / income) * 100);
    } else {
      this.percentage = -1;
    }
  };
  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var totalMoney = function (type) {
    var sum = 0;
    data.allList[type].forEach(function (obj) {
      sum += obj.value;
    });
    data.total[type] = sum;
  };

  var data = {
    allList: {
      exp: [],
      inc: [],
    },
    total: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    ratio: -1,
  };
  return {
    calculatePercentages: function () {
      data.allList.exp.forEach(function (obj) {
        obj.calcPercentage(data.total.inc);
      });
    },
    getPercentages: function () {
      var percents = data.allList.exp.map(function (obj) {
        return obj.percentage;
      });
      return percents;
    },
    addItem: function (type, description, value) {
      var ID, newItem, list;
      list = data.allList[type];
      //ID
      if (list.length === 0) {
        ID = 0;
      } else {
        ID = list[list.length - 1].id + 1;
      }
      // creating object
      if (type === "exp") {
        newItem = new Expense(ID, description, value);
      } else if (type === "inc") {
        newItem = new Income(ID, description, value);
      }
      //pushing to the data structure
      list.push(newItem);
      // returning the newItem
      return newItem;
    },
    deleteItem: function (type, id) {
      data.allList[type] = data.allList[type].filter(function (obj) {
        return obj.id !== id;
      });
    },
    dataStructure: function () {
      return data;
    },
    calculateBudget: function () {
      //Calculation of expense and income
      totalMoney("inc");
      totalMoney("exp");
      //Budget
      data.budget = data.total.inc - data.total.exp;
      //Ratio
      if (data.total.inc > 0) {
        data.ratio = Math.round((data.total.exp / data.total.inc) * 100);
      } else {
        data.ratio = -1;
      }
    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalExpense: data.total.exp,
        totalIncome: data.total.inc,
        ratio: data.ratio,
      };
    },
  };
})();

var UIController = (function () {
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputAdd: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    ratioLabel: ".budget__expenses--percentage",
    container: ".container",
    percentagesLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };
  var nodeForEach = function (fields, callback) {
    for (var i = 0; i < fields.length; i++) {
      callback(fields[i], i);
    }
  };
  var formatNumber = function (num, type) {
    var intAndDecimal, integer, decimal;
    num = Math.abs(num);
    num = num.toFixed(2);
    intAndDecimal = num.split(".");
    integer = intAndDecimal[0];
    decimal = intAndDecimal[1];
    if (integer.length > 3) {
      integer =
        integer.substr(0, integer.length - 3) +
        "," +
        integer.substr(integer.length - 3, 3);
    }
    return (type == "inc" ? "+ " : "- ") + integer + "." + decimal;
  };
  return {
    getInput: function () {
      return {
        //getting values of input
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      };
    },
    getDOM: function () {
      return DOMStrings;
    },
    addItemToUI: function (obj, type) {
      var html, element, newHtml;

      //declaring html with placeholder and element
      if (type === "inc") {
        element = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMStrings.expenseContainer;
        html =
          '<div class="item clearfix" id="exp-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //replacing placeholder

      newHtml = html.replace("%ID%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      //adding it to DOM
      document.querySelector(element).insertAdjacentHTML("afterbegin", newHtml);
    },
    displayPercentages: function (percentages) {
      var textFields = document.querySelectorAll(DOMStrings.percentagesLabel);

      nodeForEach(textFields, function (object, index) {
        if (percentages[textFields.length - index - 1] > 0) {
          object.textContent = percentages[textFields.length - index - 1] + "%";
        } else {
          object.textContent = "---";
        }
      });
    },
    clearInputs: function () {
      var inputs, inputList;

      inputs = document.querySelectorAll(
        DOMStrings.inputDescription + ", " + DOMStrings.inputValue
      );
      inputList = Array.prototype.slice.call(inputs);
      inputList.forEach(function (input) {
        input.value = "";
      });
      inputList[0].focus();
    },
    deleteItemUI: function (itemID) {
      var element = document.getElementById(itemID);
      element.parentNode.removeChild(element);
    },
    turnRed: function () {
      var elements = document.querySelectorAll(
        DOMStrings.inputDescription +
          "," +
          DOMStrings.inputValue +
          "," +
          DOMStrings.inputType
      );
      nodeForEach(elements, function (current) {
        current.classList.toggle("red-focus");
      });
      document.querySelector(DOMStrings.inputAdd).classList.toggle("red");
    },
    displayDate: function () {
      var date, year, month;
      var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      date = new Date();
      year = date.getFullYear();
      month = date.getMonth();
      document.querySelector(DOMStrings.dateLabel).textContent =
        monthNames[month] + " " + year;
    },
    displayBudget: function (obj) {
      var type;
      obj.budget >= 0 ? (type = "inc") : (type = "exp");
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(
        obj.totalIncome,
        "inc"
      );
      document.querySelector(
        DOMStrings.expenseLabel
      ).textContent = formatNumber(obj.totalExpense, "exp");
      if (obj.ratio > 0) {
        document.querySelector(DOMStrings.ratioLabel).textContent =
          obj.ratio + "%";
      } else {
        document.querySelector(DOMStrings.ratioLabel).textContent = "---";
      }
    },
  };
})();

var MainController = (function (BudgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOMStrings = UICtrl.getDOM();
    document
      .querySelector(DOMStrings.container)
      .addEventListener("click", ctrlDeleteItem);
    document
      .querySelector(DOMStrings.inputAdd)
      .addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOMStrings.inputType)
      .addEventListener("change", UICtrl.turnRed);
  };
  var updatePercentages = function () {
    //Calculating
    BudgetCtrl.calculatePercentages();
    //Getting
    var percentages = BudgetCtrl.getPercentages();
    //Displaying
    UICtrl.displayPercentages(percentages);
  };
  var updateBudget = function () {
    //1Calculate budget
    BudgetCtrl.calculateBudget();
    //2Return budget
    var budget = BudgetCtrl.getBudget();
    //3Dipslaying
    UICtrl.displayBudget(budget);
  };

  //deleting

  var ctrlDeleteItem = function (e) {
    var element, idArr, type, id;

    element = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (element) {
      idArr = element.split("-");
      type = idArr[0];
      id = parseInt(idArr[1]);

      //delete in data structure
      BudgetCtrl.deleteItem(type, id);
      console.log(BudgetCtrl.dataStructure());
      //delete UI
      UICtrl.deleteItemUI(element);
      //recalculate budget
      updateBudget();
      //calculating and updating percentages
      updatePercentages();
    }
  };

  var ctrlAddItem = function () {
    //1 Get input value
    var inputData = UICtrl.getInput();
    if (
      inputData.description &&
      !isNaN(inputData.value) &&
      inputData.value > 0
    ) {
      //2 Add the item to budgetController
      var newItem = BudgetCtrl.addItem(
        inputData.type,
        inputData.description,
        inputData.value
      );
      //3 Add the item to UIController
      UIController.addItemToUI(newItem, inputData.type);

      //4 Clear inputs
      UIController.clearInputs();

      //5 Calculating and displaying budget
      updateBudget();
      //6calculating and updating percentages
      updatePercentages();
    }
  };
  return {
    init: function () {
      UICtrl.displayDate();
      UICtrl.displayBudget({
        budget: 0,
        totalExpense: 0,
        totalIncome: 0,
        ratio: -1,
      });
      setupEventListeners();
    },
  };
})(BudgetController, UIController);

MainController.init();
