export const SPECIAL_SEARCH = [
    { name: 'Nổi bật', path: 'hot-product', field: 'numberVisit' },
    { name: 'Bán chạy', path: 'best-seller', field: 'numberBuy' },
    { name: 'Mới nhất', path: 'new-product', field: 'date' }];



export const OPTION = [
    { key:1, name:'Mới nhất', sort: ['date','-1'] },
    { key:2, name:'Cũ nhất', sort: ['date','1'] },
    { key:3, name:'Bán chạy', sort: ['numberBuy','-1'] },
    { key:4, name:'Giá tăng dần',sort: ['price','1']},
    { key:5, name:'Giá giảm dần', sort: ['price','-1']}];