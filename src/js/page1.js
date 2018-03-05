const Page1 = {
    init(){
        new Vue({
            components: {'vue-hello': VueHello},
            el: '#app',
            data: {
                test: 'TEST'
            }
        });
    }
};
