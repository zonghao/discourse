import evenRound from "discourse/plugins/poll/lib/even-round";
import computed from "ember-addons/ember-computed-decorators";

export default Em.Component.extend({
  tagName: "ul",
  classNames: ["results"],

  @computed("poll.voters", "poll.options.[]", "poll.isMultiple")
  options() {
    const options = this.get("poll.options");
    const voters = this.get("poll.voters");
    let percentages = voters === 0 ?
      Array(options.length).fill(0) :
      _.map(options, o => 100 * o.get("votes") / voters);

    // fix percentages to add up to 100 when the poll is single choice only
    if (!this.get("poll.isMultiple")) {
      percentages = evenRound(percentages);
    }

    options.forEach((option, i) => {
      const percentage = percentages[i];
      const style = new Ember.Handlebars.SafeString(`width: ${percentage}%`);

      option.setProperties({
        percentage,
        style,
        title: I18n.t("poll.option_title", { count: option.get("votes") })
      });
    });

    return this.get("poll.options");
  }

});
