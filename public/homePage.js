const logoutButton = new LogoutButton();

logoutButton.action = () => {
    ApiConnector.logout(response => {
           if(response.success) {
            location.reload();
        } 
    })     
}


const getCurrentUser = () => ApiConnector.current(response => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
})

getCurrentUser();


const ratesBoard = new RatesBoard();

const getExchangeRates = () => ApiConnector.getStocks(response => {
    if(response.success) {
        ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
    }    
})

getExchangeRates();
setInterval(getExchangeRates, 60000);


const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if(!data.currency) {
            moneyManager.setMessage(false, 'Такая валюта не существует');
        } else if(!data.amount) {
            moneyManager.setMessage(false, 'Ошибка при переводе значения в число');
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Баланс успешно пополнен!');
    }
}  
)}

moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if(!data.fromAmount) {
            moneyManager.setMessage(false, 'Ошибка при переводе значения в число');
        } else if(!data.fromCurrency) {
            moneyManager.setMessage(false, 'Исходная валюта не была выбрана');
        } else if(!data.targetCurrency) {
            moneyManager.setMessage(false, 'Целевая валюта не была выбрана');
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Конвертация валюты выполнена');
        }
    })
}

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if(!data.to) {
            moneyManager.setMessage(false, 'Получатель не найден');
        } else if(!data.amount) {
            moneyManager.setMessage(false, 'Ошибка при переводе значения в число')
        } else if(!data.currency) {
            moneyManager.setMessage(false, 'Валюта для перевода не выбрана')
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Перевод валюты выполнен!')
        } 
    })
}

const favoritesWidget = new FavoritesWidget();

const getFavoritesList = () => ApiConnector.getFavorites(response => {     
    if(response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
})

getFavoritesList();

favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {              
        if(!response.success) {
            favoritesWidget.setMessage(false, 'Поля для ввода должны быть заполены!');
        } else {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, 'Пользователь добавлен в список избранных!')
        }        
    })
}

favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        console.log(response);
        
        if(response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, 'Пользователь удален!')
        } else {
            favoritesWidget.setMessage(false, 'Ошибка! Невозможно удалить пользователя из избранного.')
        }           
        
    })
}
