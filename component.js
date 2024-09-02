/*global Vue set_style_mixin */
/** https://gist.github.com/eolant/ba0f8a5c9135d1a146e1db575276177d
 * Vuetify Confirm Dialog component
 *
 * Insert component where you want to use it:
 * <confirm ref="confirm"></confirm>
 *
 * Call it:
 * this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' }).then((confirm) => {})
 * Or use await:
 * if (await this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' })) {
 *   // yes
 * }
 * else {
 *   // cancel
 * }
 *
 * Alternatively you can place it in main App component and access it globally via this.$root.$confirm
 * <template>
 *   <v-app>
 *     ...
 *     <confirm ref="confirm"></confirm>
 *   </v-app>
 * </template>
 *
 * mounted() {
 *   this.$root.$confirm = this.$refs.confirm.open
 * }
 */

Vue.component("simple-dialog", {
  data: function () {
    return {
      dialog: false,
      type: null,
      value: null,
      resolve: null,
      reject: null,
      message: null,
      title: null,
      options: this.$options.default_options
    };
  },
  default_options: {
    titleColor: "primary",
    width: "80%",
    zIndex: 200,
    buttonOk: {
      text: "OK",
      color: "success"
    },
    buttonCancel: {
      text: "Cancel",
      color: "error"
    },
    input: {
      label: "input",
      placeholder: "Enter a text",
      value: ""
    }
  },
  methods: {
    confirm(title, message, options) {
      this.type = "confirm";
      return this._do_dlg(title, message, options);
    },
    alert(title, message, options) {
      this.type = "alert";
      return this._do_dlg(title, message, options);
    },
    input(title, message, options) {
      this.type = "input";
      this.value = options.input.value;
      return this._do_dlg(title, message, options);
    },
    _do_dlg(title, message, options) {
      this.dialog = true;
      this.title = title;
      this.message = message;
      this.options = this.merge_options(options, this.$options.default_options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      if (this.type === "input") {
        this.resolve(this.value);
      } else {
        this.resolve(true);
      }
      this.dialog = false;
    },
    cancel() {
      if (this.type === "alert") {
        return; // no-op
      } else if (this.type === "input") {
        this.resolve(this.options.input.value);
      } else {
        this.resolve(false);
      }
      this.dialog = false;
    },
    merge_options(opts, def_opts) {
      if (Array.isArray(def_opts)) {
        if (!Array.isArray(opts)) {
          return def_opts;
        }
        let a = [];
        for (let i = 0; i < def_opts.length; i++) {
          if (i < opts.length) {
            a[i] = this.merge_options(opts[i], def_opts[i]);
          } else {
            a[i] = def_opts[i];
          }
        }
        return a;
      } else if (typeof def_opts === "object") {
        if (typeof opts !== "object") {
          return def_opts;
        }
        const s = Object.prototype.toString.call(def_opts);
        if (s === "[object RegExp]" || s === "[object Date]") {
          return Object.prototype.toString.call(opts) === s ? opts : def_opts;
        }
        let a = {};
        for (const p in def_opts) {
          if (typeof opts[p] === "undefined") {
            a[p] = def_opts[p];
          } else {
            a[p] = this.merge_options(opts[p], def_opts[p]);
          }
        }
        return a;
      }
      // simple types
      return typeof opts !== typeof def_opts ? def_opts : opts;
    }
  },
  template: `
    <div class="simple-dialog">
      <v-dialog persistent v-model="dialog" :max-width="options.width" :style="{ zIndex: options.zIndex }" 
        @keydown.esc="cancel" @keydown.enter="agree">
      <v-card>
        <v-toolbar :color="options.titleColor" dense flat>
          <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text v-show="!!message" class="pa-4"><div v-html="message"></div>
        <div v-if="type === 'input'"><v-textarea
        v-model="value" :placeholder="options.input.placeholder"
        :label="options.input.label" clearable auto-grow rows=1 @keydown.enter="agree"></v-textarea></div>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn :color="options.buttonOk.color" text @click.native="agree">{{options.buttonOk.text}}</v-btn> 
          <v-btn v-if="type !== 'alert'" :color="options.buttonCancel.color" text @click.native="cancel">{{options.buttonCancel.text}}</v-btn>
        </v-card-actions>
      </v-card>
     </v-dialog>
    </div>
  `
});

Vue.component("file-dialog", {
  data: function () {
    return {
      dialog: false,
      value: null,
      resolve: null,
      reject: null,
      message: null,
      title: null,
      options: this.$options.default_options
    };
  },
  default_options: {
    titleColor: "primary",
    width: "80%",
    zIndex: 200,
    buttonOk: {
      text: "OK",
      color: "success"
    },
    buttonCancel: {
      text: "Cancel",
      color: "error"
    },
    file: {
      label: "Pick A File",
      hint: "Select a file",
      multiple: false,
      icon: "mdi-file-document-outline",
      accept: ""
    }
  },
  methods: {
    filePicker(title, message, options) {
      this.value = null;
      return this._do_dlg(title, message, options);
    },
    _do_dlg(title, message, options) {
      this.dialog = true;
      this.title = title;
      this.message = message;
      if (options.file.multiple && !options.file.icon) {
        options.file.icon = "mdi-file-document-multiple-outline";
      }
      this.options = this.merge_options(options, this.$options.default_options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    done() {
      if (!this.value) return;
      this.resolve(this.value);
      this.dialog = false;
    },
    cancel() {
      if (this.options.file.multiple) {
        this.resolve([]);
      } else {
        this.resolve(null);
      }
      this.dialog = false;
    },
    merge_options(opts, def_opts) {
      if (Array.isArray(def_opts)) {
        if (!Array.isArray(opts)) {
          return def_opts;
        }
        let a = [];
        for (let i = 0; i < def_opts.length; i++) {
          if (i < opts.length) {
            a[i] = this.merge_options(opts[i], def_opts[i]);
          } else {
            a[i] = def_opts[i];
          }
        }
        return a;
      } else if (typeof def_opts === "object") {
        if (typeof opts !== "object") {
          return def_opts;
        }
        const s = Object.prototype.toString.call(def_opts);
        if (s === "[object RegExp]" || s === "[object Date]") {
          return Object.prototype.toString.call(opts) === s ? opts : def_opts;
        }
        let a = {};
        for (const p in def_opts) {
          if (typeof opts[p] === "undefined") {
            a[p] = def_opts[p];
          } else {
            a[p] = this.merge_options(opts[p], def_opts[p]);
          }
        }
        return a;
      }
      // simple types
      return typeof opts !== typeof def_opts ? def_opts : opts;
    }
  },
  template: `
    <div class="file-dialog">
      <v-dialog persistent v-model="dialog" :max-width="options.width" :style="{ zIndex: options.zIndex }" 
        @keydown.esc="cancel" @keydown.enter="done">
      <v-card>
        <v-toolbar :color="options.titleColor" dense flat>
          <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text v-show="!!message" class="pa-4"><div v-html="message"></div>
        <div><v-file-input v-model="value" :label="options.file.label" truncate-length="1024" 
          :multiple="options.file.multiple" :chips="options.file.multiple" :counter="options.file.multiple"
          :prepend-icon="options.file.icon" :hint="options.file.hint" persistent-hint :show-size="1024" :accept="options.file.accept"
          @keydown.enter="done" @keydown.esc="cancel"></v-file-input></div>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn :color="options.buttonOk.color" text @click.native="done">{{options.buttonOk.text}}</v-btn> 
          <v-btn :color="options.buttonCancel.color" text @click.native="cancel">{{options.buttonCancel.text}}</v-btn>
        </v-card-actions>
      </v-card>
     </v-dialog>
    </div>
  `
});
