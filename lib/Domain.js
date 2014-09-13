function Domain() {
    this._roles = {};
    this._contexts = {};
}

Object.defineProperties(Domain.prototype, {
    registerRole: {
        value: function (contextName, role) {

        }
    },
    registerContext: {
        value: function (name, context) {

        }
    }
})

module.exports = Domain;