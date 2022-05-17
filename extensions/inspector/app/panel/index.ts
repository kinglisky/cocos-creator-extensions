import { App } from 'vue';
import { create } from './app';

let app: App<Element> | null = null;

module.exports = Editor.Panel.define({
    template: `<div id="app"></div>`,
    $: {
        app: '#app',
    },
    methods: {},
    listeners: {
        show() {
            console.log('show');
        },
        hide() {
            console.log('hide');
        },
    },

    update() {
        console.log('update');
    },

    async ready() {
        console.log('ready');
        if (!this.$.app) return;
        if (!app) {
            app = create(this.$.app);
        }
    },

    close() {
        console.log('close');
    },
});
