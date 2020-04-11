/*----------------------------------------------------------------------------------------------------------
----------------BUDGET CONTROLLER--------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------*/



var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calPercentage = function (totalIncome) {
        if (totalIncome > 0)
            this.percentage = Math.round(this.value / totalIncome * 100);
        else
            this.percentage = -1;
    }
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (current, id, array) {
            sum += current.value;
        });
        data.totals[type] = sum;


    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1,
    };
    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            ID = 0;
            // CREATE NEW IDS
            if (data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

            //CREATE NEW ELEMENT
            if (type === 'exp')
                newItem = new Expense(ID, des, val);
            else
                newItem = new Income(ID, des, val);


            //CAUSE TYPE EQUALS exp OR inc COOL
            data.allItems[type].push(newItem);
            //RETURN NEW TEM
            return newItem;
        },
        deleteItem: function (type, id) {
            var ids, index;
            ids = data.allItems[type].map(function (current, id, array) {
                return current.id;
            });
            index = ids.indexOf(id);
            if (index != -1)
                data.allItems[type].splice(index, 1, );
        },
        testing: function () {
            console.log(data);
        },
        calculateBudget: function () {
            //calculte total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');
            //calculte Budget
            data.budget = data.totals.inc - data.totals.exp;
            //calculate the percentage of expenses
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
        },
        calcultePercentages: function () {
            data.allItems.exp.forEach(function (current) {
                current.calPercentage(data.totals.inc);
            });
        },
        getBudget: function () {
            return {
                totalExp: data.totals.exp,
                totalInc: data.totals.inc,
                budget: data.budget,
                percentage: data.percentage,
            };
        },
        getPercentages: function () {
            var allPercentages = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPercentages;
        },
    };

})();

/*----------------------------------------------------------------------------------------------------------
----------------UI CONTROLLER--------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------*/




var uiController = (function () {

    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLable: '.budget__value',
        incomeLable: '.budget__income--value',
        expensesLable: '.budget__expenses--value',
        percentageLable: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLable: '.item__percentage',
        monthLable: '.budget__title--month',

    };
    var formatNumber = function (num) {
        var numSplit, cnt = 0,
            newNum = '',
            s1, s2;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        int = numSplit[0];
        for (var i = int.length - 1; i >= 0; i--) {
            if (cnt % 3 === 0 && cnt !== 0)
                newNum = ',' + newNum;
            newNum = int[i] + newNum;
            cnt++;
        }

        dec = numSplit[1];

        return newNum + '.' + dec;
    };
    var nodeListForEach = function (list, calllback) {
        for (var i = 0; i < list.length; i++) {
            calllback(list[i], i);
        }
    };
    return {
        getinput: function () {
            return {
                type: document.querySelector(domStrings.inputType).value, //will either inc or exp
                description: document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value)
            }
        },
        getDomStrings: function () {
            return domStrings;
        },
        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(domStrings.expensesPercentageLable);


            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0)
                    current.textContent = percentages[index] + '%';
                else
                    current.textContent = '---';
            });
        },
        addListItem: function (obj, type) {
            var html, newHtml;
            if (type === 'inc') {
                element = domStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                element = domStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function (selectorId) {
            var element = document.getElementById(selectorId);
            element.parentNode.removeChild(element);
        },
        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(domStrings.inputDescription + ',' + domStrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (current, index, array) {
                current.value = '';

            });
            fieldsArray[0].focus();
        },
        displayBuget: function (obj) {
            if (obj.budget >= 0)
                document.querySelector(domStrings.budgetLable).textContent = '+ ' + formatNumber(Math.abs(obj.budget));
            else
                document.querySelector(domStrings.budgetLable).textContent = '-  ' + formatNumber(Math.abs(obj.budget));

            document.querySelector(domStrings.incomeLable).textContent = '+ ' + formatNumber(Math.abs(obj.totalInc));
            document.querySelector(domStrings.expensesLable).textContent = '- ' + formatNumber(Math.abs(obj.totalExp));
            if (obj.percentage > 0)
                document.querySelector(domStrings.percentageLable).textContent = obj.percentage + '%';
            else
                document.querySelector(domStrings.percentageLable).textContent = '----';

        },
        displayMonth: function () {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth();
            var date = now.getDate();
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            document.querySelector(domStrings.monthLable).textContent = date + ' ' + months[month] + ', ' + year;
            console.log(year);
            //var christmas = new Date(2016,11,25);
        },
        changedType: function () {
            fields = document.querySelectorAll(
                domStrings.inputDescription + ',' +
                domStrings.inputType + ',' +
                domStrings.inputValue);
            
            nodeListForEach(fields, function (current, index) {
                current.classList.toggle('red-focus');
                console.log(current);
            });
            document.querySelector(domStrings.inputBtn).classList.toggle('red');
        }

    }
})();


/*----------------------------------------------------------------------------------------------------------
----------------CONTROLLER--------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------*/





var controller = (function (budgetCtrl, uiCtrl) {


    var setUpEventListeners = function () {

        var dom = uiCtrl.getDomStrings();
        document.querySelector(dom.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(dom.inputType).addEventListener('click', uiCtrl.changedType);
    }

    //calculate the budget
    var updateBudget = function () {
        //calculate budget
        budgetCtrl.calculateBudget();
        //get Budget
        var budget;
        budget = budgetCtrl.getBudget();
        //display BUDGET
        uiCtrl.displayBuget(budget);

    };

    var updatePercentages = function () {
        // calculte percentages
        budgetCtrl.calcultePercentages();


        //read from budgetctrl
        var percentages = budgetCtrl.getPercentages();

        //update ui
        uiCtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function () {
        var input, newItem;
        //get inputs
        input = uiCtrl.getinput();
        //Add data to budget controller
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            uiCtrl.addListItem(newItem, input.type);
            uiCtrl.clearFields();
            //calculate and update budget
            updateBudget();
            updatePercentages();
        }
    };
    var ctrlDeleteItem = function (event) {
        var itemId, splitId, type, id;
        itemId = (event.target.parentNode.parentNode.parentNode.parentNode.id);
        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            id = splitId[1];
            id = parseInt(id);
            //delete the item from data
            budgetCtrl.deleteItem(type, id);

            //delete the item from ui;
            uiCtrl.deleteListItem(itemId);


            //update budget
            updateBudget();
            updatePercentages();
        }
    };
    return {
        init: function () {
            updateBudget({
                totalExp: 0,
                totalInc: 0,
                budget: 0,
                percentage: 0,
            });
            setUpEventListeners();
            uiCtrl.displayMonth();
        }
    };

})(budgetController, uiController);
controller.init();
