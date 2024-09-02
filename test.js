/*global Vue Vuetify */
new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data: {
    result: null,
    result_text: ""
  },
  computed: {},
  mounted() {
    this.$root.$confirm = this.$refs.dialog.confirm;
    this.$root.$alert = this.$refs.dialog.alert;
    this.$root.$input = this.$refs.dialog.input;
    this.$root.$file = this.$refs.file_dialog.filePicker;
  },
  methods: {
    async show_confirm() {
      this.result = await this.$root.$confirm(
        "Delete",
        "We will delete some thing here <b>important</b>. <br/>Are you sure?",
        {
          titleColor: "primary",
          buttonOk: {
            text: "Yes",
            color: "primary"
          },
          buttonCancel: {
            text: "No"
          }
        }
      );
      console.log("confirm", this.result);
      this.result_text = `Confirmed? ${this.result}`;
    },
    async show_alert() {
      this.result = await this.$root.$alert(
        "Delete This",
        "We will delete some thing here <b>important</b>. <br/>Are you sure?",
        {
          titleColor: "error",
          buttonOk: {
            text: "OK"
          }
        }
      );
      console.log("alert", this.result);
      this.result_text = `Alert acknowledged? ${this.result}`;
    },
    async show_input() {
      this.result = await this.$root.$input(
        "Rename This",
        "Please enter a new name:",
        {
          titleColor: "success",
          input: {
            label: "new name",
            value: "old name"
          },
          buttonOk: {
            text: "Done"
          }
        }
      );
      console.log("input", this.result);
      this.result_text = `Input: "${this.result ? this.result : ""}"`;
    },
    async show_file_single() {
      this.result = await this.$root.$file(
        "Pick A File",
        "Please pick a file:",
        {
          titleColor: "success",
          file: {
            label: "Chose a file to start",
            hint: "Please pick a file to start this process.",
            multiple: false,
            accept: ".log,.txt"
          },
          buttonOk: {
            text: "Done"
          }
        }
      );
      console.log("single file", this.result instanceof File, this.result);
      this.result_text = `File: ${this.result ? this.result.name : "<none>"}`;
    },
    async show_file_multiple() {
      this.result = await this.$root.$file(
        "Pick One or More Files",
        "Please pick one or more files:",
        {
          titleColor: "success",
          file: {
            label: "Chose one or more files to start with",
            hint: "Please pick one or more files to start it.",
            multiple: true,
            icon: "mdi-file-multiple-outline",
            accept: ".log,.txt"
          },
          buttonOk: {
            text: "Done"
          }
        }
      );
      console.log("multiple files", this.result);
      var arr = [];
      this.result.forEach((item) => {
        arr.push(item.name);
      });
      this.result_text = `Files: ${arr.length > 0 ? arr.join(", ") : "<none>"}`;
    }
  }
});
