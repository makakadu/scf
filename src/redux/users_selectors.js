import {createSelector} from 'reselect'

// если я правильно понял, то reselect нужна в том случае, если нам нужно возратить из state обработанные данные, то есть, чтобы селектор обработал данные перед тем как их возвратить. Но нужно сделать так, чтобы они обрабатывались только если они изменились с прошлого раза.
export const getUsers = createSelector( // если я правильно понял, то createSelector возвращает функцию, которая принимает state
    state => state.usersPage.users, // первый аргумент - это селектор, который принимает state и возвращает что-то одно из state
    users => users.filter(user => user) // второй аргумент - это функция, которая принимает то, что возвращает селектор выше, если селектор выше возвращает другие данные(например, в users добавили нового user), то эта функция выполнится, если селектор выше возвратит данные в таком же состоянии как и в прошлый раз, то функция выполнена НЕ будет.
)

export const getCurrentPage = (state) => {
    return state.usersPage.currentPage
}

export const getPageSize = (state) => {
    return state.usersPage.pageSize
}

export const getTotalUsersCount = (state) => {
    return state.usersPage.totalUsersCount
}

export const getIsFetching = (state) => {
    return state.usersPage.isFetching
}
