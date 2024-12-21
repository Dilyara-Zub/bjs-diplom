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
        ratesBoard.fillTable(response.data)
    }    
})

getExchangeRates();
setInterval(getExchangeRates, 60000);


const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Баланс успешно пополнен!')
        } else {
            moneyManager.setMessage(false, 'Операция не выполнена!')
        }      
    })
    
}

moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Конвертация валюты выполнена')
        } else {
            moneyManager.setMessage(false, 'Операция не выполнена!')
        }           
    })
}

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Перевод валюты выполнен!')
        } else {
            moneyManager.setMessage(false, 'Перевод валюты не выполнен!')
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
        if(response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(true, 'Пользователь добавлен в список избранных!')
        } else {
            moneyManager.setMessage(false, 'Ошибка! Невозможно добавить пользователя в список избранных.')
        }           
        
    })
}

favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if(response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(true, 'Пользователь удален!')
        } else {
            moneyManager.setMessage(false, 'Ошибка! Невозможно удалить пользователя из избранного.')
        }           
        
    })
}