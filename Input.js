(function() {
    var KEYS = {
        // "DESK_MENU" : 0,  // Detected on desktop
        "BACKSPACE": 8,
        "TAB": 9,
        "CLEAR": 12, // Mac keyboard
        // "DN_LOCK"   : 12,
        "ENTER": 13,
        "SHIFT": 16,
        "CTRL": 17,
        "ALT": 18,
        "CAPS": 20,
        "ESC": 27,
        "SPACE": 32,
        "PAGE_UP": 33,
        "PAGE_DOWN": 34,
        "END": 35,
        "HOME": 36,
        //////////////////////
        "LEFT": 37,
        "UP": 38,
        "RIGHT": 39,
        "DOWN": 40,
        "INSERT": 45,
        "DELETE": 46,
        //////////////////////
        "0": 48,
        "1": 49,
        "2": 50,
        "3": 51,
        "4": 52,
        "5": 53,
        "6": 54,
        "7": 55,
        "8": 56,
        "9": 57,
        //////////////////////
        "A": 65,
        "B": 66,
        "C": 67,
        "D": 68,
        "E": 69,
        "F": 70,
        "G": 71,
        "H": 72,
        "I": 73,
        "J": 74,
        "K": 75,
        "L": 76,
        "M": 77,
        "N": 78,
        "O": 79,
        "P": 80,
        "Q": 81,
        "R": 82,
        "S": 83,
        "T": 84,
        "U": 85,
        "V": 86,
        "W": 87,
        "X": 88,
        "Y": 89,
        "Z": 90,

        "L_START": 91, // usual keyboard
        "R_START": 92,
        "L_CMD": 91, // Mac's keyboard
        "R_CMD": 93,
        "MENU": 93, // Detected on laptop keyboard
        "N0": 96,
        "N1": 97,
        "N2": 98,
        "N3": 99,
        "N4": 100,
        "N5": 101,
        "N6": 102,
        "N7": 103,
        "N8": 104,
        "N9": 105,
        "N*": 106,
        "N+": 107,
        "N-": 109,
        "N.": 110,
        "N/": 111,
        "F1": 112,
        "F2": 113,
        "F3": 114,
        "F4": 115,
        "F5": 116,
        "F6": 117,
        "F7": 118,
        "F9": 120,
        "F10": 121,
        "NUM_LOCK": 144,

        ";": 186, // ;
        "=": 187, // =
        ",": 188, // ,
        "-": 189, // -
        ".": 190, // .
        "/": 191, // /
        "`": 192, // `
        "[": 219, // [
        "\\": 220, // \
        "]": 221, // ]
        "'": 222 // '
    };

    var OPERA_11 = {
        ";": 59,
        "=": 61,
        "-": 109,
        "L_START": 219,
        "N0": 48,
        "N1": 49,
        "N2": 50,
        "N3": 51,
        "N4": 52,
        "N5": 53,
        "N6": 54,
        "N7": 55,
        "N8": 56,
        "N9": 57,
        "N*": 42,
        "N+": 43,
        "N-": 45,
        "N.": 78,
        "N/": 47
    }

    var FIREFOX_14 = {
        ";": 59,
        "=": 107,
        "-": 109
    }

    var FIREFOX_15 = {
        ";": 59,
        "=": 61,
        "-": 173
    }


    var State_Machine = {

        add: function(machine, keys_array) { // id array
            if (machine['start'] == void 0) {
                machine['start'] = {};
            }
            if (machine['start'][KEYS[keys_array[0]]]) {
                machine['start'][KEYS[keys_array[0]]] ++;
            } else {
                machine['start'][KEYS[keys_array[0]]] = 1;
            }
            var len = keys_array.length;
            var key, value;
            for (var i = 0; i < len - 1; i++) {
                key = KEYS[keys_array[i]];
                value = KEYS[keys_array[i + 1]];
                if (machine[key] == void 0) {
                    machine[key] = {};
                }
                if (machine[key][value]) {
                    machine[key][value] ++;
                } else {
                    machine[key][value] = 1;
                }
            }
        }
    };

    //=====================================================================================
    var Private = {
        is_string: function(obj) {
            return Object.prototype.toString.call(obj) === "[object String]";
        },

        is_boolean: function(obj) {
            return Object.prototype.toString.call(obj) === "[object Boolean]";
        },

        is_function: function(obj) {
            return Object.prototype.toString.call(obj) === '[object Function]';
        },

        is_undefined: function(obj) {
            return obj === void 0;
        },

        is_empty: function(obj) { // Test if something is {} or [] not
            if (obj == null) return true;
            if (obj.length > 0) return false;
            if (obj.length === 0) return true;
            for (var key in obj) {
                if (this.hasProp(obj, key)) {
                    return false;
                }
            }
            return true;
        },

        cross_browser: function() {
            var browser = this.get_user_browser();
            // If the browser is Opera and version is under 12
            if (browser.indexOf("Opera") != -1 && browser.substring(6, browser.length) < 12) {
                this.extend(KEYS, OPERA_11);
                return;
            }
            // If the browser is Firefox and version is under 15
            if (browser.indexOf("Firefox") != -1 && browser.substring(8, browser.length) < 15) {
                this.extend(KEYS, FIREFOX_14);
                return;
            }
            // If the browser is Firefox and version is above 15(including it)
            if (browser.indexOf("Firefox") != -1 && browser.substring(8, browser.length) >= 15) {
                this.extend(KEYS, FIREFOX_15);
                return;
            }
        },


        // This is an awesome solution to get browser name and version from Stackflow
        // http://stackoverflow.com/questions/5916900/detect-version-of-browser
        get_user_browser: function() {
            var user_agent = navigator.userAgent;
            var temp, result;
            result = user_agent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            // IE would give ["Trident/7", "Trident", "7"]
            // Older versions of Opera would give something like ["Opera/9", "Opera", "9"]
            // Newer version of Opera would give something like ["Chrome/39", "Chrome", "39"]
            // Chrome would also give something like ["Chrome/39", "Chrome", "39"]
            // Firefox would give something like [ "Firefox/33", "Firefox", "33" ]
            // Safari would give something like ["Safari/600", "Safari", "600"]

            // If user agent is IE
            if (/trident/i.test(result[1])) {
                // Get the version of IE

                // userAgent in IE would be something like 
                // ( "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2;
                //   .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729;
                //   Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.3; rv:11.0) like Gecko" )
                temp = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE ' + (temp[1] || '');
            }
            // If user agent is modern version of Opera

            // userAgent in newer version of Opera(after 15.0(including it)) would be something like 
            // "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) 
            // Chrome/39.0.2171.62 Safari/537.36 OPR/26.0.1656.20 (Edition beta)"

            // You can tell it will return "Chrome", so we need to check if OPR exists
            if (result[1] === 'Chrome') {
                temp = user_agent.match(/\bOPR\/(\d+)/)
                if (temp != null) return 'Opera ' + temp[1];
            }

            result = result[2] ? [result[1], result[2]] : [navigator.appName, navigator.appVersion, '-?'];
            // In Safari, user_agent would be something like
            // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.1.25 (KHTML, like Gecko) Version/8.0 Safari/600.1.25"
            // We need to check if "Version" exists in the string

            // In older version of Opera, user_agent would be something like
            // "Opera/9.80 (Windows NT 6.1; Win64; x64) Presto/2.12.388 Version/12.17"
            // We need to check if "Version" exists in the string
            if ((temp = user_agent.match(/version\/(\d+)/i)) != null) result.splice(1, 1, temp[1]);
            return result.join(' ');
        },

        extend: function(obj1, obj2) {
            for (var i in obj2) {
                obj1[i] = obj2[i];
            }
        },

        same_array: function(first, second) {
            if (first.length !== second.length) return false;
            var len = first.length;
            for (var i = 0; i < len; i++) {
                if (first[i] !== second[i]) return false;
            }
            return true;
        },

        hasProp: function(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        },

        string_to_array: function(obj) {
            var ret = obj.toUpperCase().replace(/\s+/g, ' ').split(" ");
            for (var i = 0; i < ret.length; i++) {
                if (ret[i] == "") {
                    ret.splice(i, 1);
                }
            }
            return ret;
        },

        string_to_object: function(obj) {
            var ret = {};
            var array = this.string_to_array(obj);
            var len = array.length;
            for (var i = 0; i < len; i++) {
                if (ret[array[i]]) {
                    ++ret[array[i]];
                } else {
                    ret[array[i]] = 1;
                }
            }
            return ret;
        },

        attach_event: function(element, event, callback) {
            if (document.addEventListener) {
                element.addEventListener(event, callback);
            } else if (document.attachEvent) {
                element.attachEvent("on" + event, callback);
            }
        },

        register_keys: function(keys_array, _this) {
            var len = keys_array.length;
            for (var i = 0; i < len; i++) {
                if (KEYS[keys_array[i]] === void 0) {
                    throw "Not support " + keys_array[i];
                }
                if (_this.active_keys[KEYS[keys_array[i]]]) {
                    _this.active_keys[KEYS[keys_array[i]]] ++;
                } else {
                    _this.active_keys[KEYS[keys_array[i]]] = 1;
                }
            }
        },

        keys_to_keycode: function(keys) {
            var keycode = "";
            var keys_array = string_to_array(keys);
            var len = keys_array.length;
            for (var i = 0; i < len; i++) {
                if (i == len - 1) {
                    keycode += keys_array[i];
                } else {
                    keycode = keycode + keys_array[i] + " ";
                }
            }
            return keycode;
        },
        make_package: function(keycode, order, callback, time) {
            var key = {};
            var value = {};
            value["order"] = order;
            value["callback"] = callback;
            value["time"] = time;
            key[keycode] = value;
            return key;
        },

        store_sizetable: function(size, _this) {
            var s_table = _this.size_table;
            var id = "";
            if (s_table[size]) {
                var len = s_table[size].length;
                var last = s_table[size][len - 1];
                id = size.toString() + (parseInt(last.substr(1, last.length - 1)) + 1);
                s_table[size].push(id);
            } else {
                id = size.toString() + 1;
                s_table[size] = [id];
            }
            return id;
        },

        store_keypackage: function(keys, ordered, callback, time, id, _this) {
            var _package = {};
            if (ordered) {
                var key_array = this.string_to_array(keys);
                _package.key = key_array;
            } else {
                var key_object = this.string_to_object(keys);
                _package.key = key_object;
            }
            _package.key_origin = keys;
            _package.order = ordered;
            _package.time = time * 1000; // Store as milliseconds
            _package.callback = callback;
            _package.keep_fire = false;
            _package.count = 0;
            _this.keys_package[id] = _package;
        },

        add_to_first: function(first, id, _this) {
            var first_to_id = _this.first_to_id;
            if (first_to_id[first] == void 0) {
                first_to_id[first] = [];
            }
            first_to_id[first].push(id);
        },

        add_combo: function(keys, callback, time, ordered, _this) {
            if (!this.is_string(keys)) {
                throw "function(ordered_combo) expects \"keys\" to be string";
            }
            if (!this.is_function(callback)) {
                throw "function(ordered_combo) expects \"callback\" to be function";
            }
            var keys_array = this.string_to_array(keys);
            if (this.is_empty(keys_array)) {
                return;
            }
            this.register_keys(keys_array, _this);
            var id = this.store_sizetable(keys_array.length, _this);
            this.store_keypackage(keys, ordered, callback, time, id, _this);
            if (ordered) {
                this.add_to_first(KEYS[keys_array[0]], id, _this);
                State_Machine.add(_this.machine, keys_array);
            }
        },

        remove_firstoid: function(key, id, _this) {
            var id_array = _this.first_to_id[key];
            var len = id_array.length;
            for (var i = 0; i < len; i++) {
                if (id_array[i] == id) {
                    id_array.splice(i, 1);
                    return;
                }
            }
        },

        remove_package: function(keys_array, _this) {
            var keys_package = _this.keys_package;
            if (this.is_empty(keys_package)) { // If nothing to remove
                return false;
            }
            var size_table = _this.size_table;
            var id_array = size_table[keys_array.length];
            var len = id_array.length;
            var id;
            for (var i = 0; i < len; i++) {
                id = id_array[i];
                if (this.same_array(keys_array, keys_package[id].key)) {
                    size_table[keys_array.length].splice(i, 1);
                    delete keys_package[id];
                    this.remove_firstoid(KEYS[keys_array[0]], id, _this);
                    return true;
                }
            }
            return false;
        },

        remove_activekeys: function(keys_array, _this) {
            var active_keys = _this.active_keys;
            var len = keys_array.length;
            for (var i = 0; i < len; i++) {
                if (active_keys[KEYS[keys_array[i]]] == 1) {
                    delete active_keys[KEYS[keys_array[i]]];
                    continue;
                }
                active_keys[KEYS[keys_array[i]]] --;
            }
        },

        remove_machine: function(keys_array, _this) {
            var machine = _this.machine;
            var len = keys_array.length;
            var keycode, value;
            keycode = KEYS[keys_array[0]];
            if (machine['start'][keycode] == 1) {
                delete machine['start'][keycode];
            } else {
                machine['start'][keycode] --;
            }
            for (var i = 0; i < len - 1; i++) {
                keycode = KEYS[keys_array[i]];
                value = KEYS[keys_array[i + 1]];
                if (machine[keycode][value] == 1) {
                    delete machine[keycode][value];
                } else {
                    machine[keycode][value] --;
                }
            }
        },

        destroy_combo: function(keys, _this) {
            if (!this.is_string(keys)) {
                throw "function(destroy_combo) expects \"keys\" to be string";
            }
            var keys_array = this.string_to_array(keys); //["A", "S"]
            if (this.remove_package(keys_array, _this)) {
                this.remove_activekeys(keys_array, _this);
                this.remove_machine(keys_array, _this);
            }
        },

        destroy_all: function(_this) {
            _this.active_keys = {};
            _this.keys_package = {};
            _this.size_table = {};
            _this.first_to_id = {};
            _this.machine = {};
            _this.keydown_buffer = [];
            _this.keyup_buffer = [];
        },

        makeup_keyup_obj: function(current, id, _this) {
            var obj = {};
            obj["current"] = current;
            obj["id"] = id;
            obj["pass"] = 1;
            obj["v"] = true;
            return obj;
        },

        timer: function(timeup, id, position, _this) {
            setTimeout((function(__this) {
                return function() {
                    var buffer = _this.keyup_buffer;
                    if (__this.is_empty(buffer)) {
                        return;
                    } // If buffer is cleared before timeup
                    for (var i = 0; i <= position; i++) {
                        if (__this.is_empty(buffer)) {
                            return;
                        } // If buffer is cleared during this stage
                        if (id == buffer[i].id) {
                            buffer[i].v = false;
                            return;
                        }
                    }
                }
            })(this), timeup);
        },

        fire: function(id_array, _this) {
            var keys_package = _this.keys_package;
            var len = id_array.length;
            var func;
            for (var i = 0; i < len; i++) {
                func = keys_package[id_array[i]].callback;
                keys_package[id_array[i]].count++;
                func();
            }
        },

        fire_keydown: function(keycode, _this) {
            // TODO
        },

        fire_keyup: function(keycode, _this) {
            // Unregistered keys
            if (!this.hasProp(_this.active_keys, keycode)) {
                _this.keyup_buffer = [];
                return;
            }
            var keyup_buffer = _this.keyup_buffer;
            var keys_package = _this.keys_package;
            var first_to_id = _this.first_to_id;
            var machine = _this.machine;
            var id_fireup = [];
            var entry, entry_package;
            for (var i = 0; i < keyup_buffer.length; i++) {
                entry = keyup_buffer[i];
                entry_package = keys_package[entry.id];
                // If no longer valid
                if (!entry.v) {
                    keyup_buffer.splice(i, 1);
                    i--;
                    continue;
                }
                // If match
                if (this.hasProp(machine[entry.current], keycode) && KEYS[entry_package.key[entry.pass]] == keycode) {
                    // If the last one
                    if (entry.pass + 1 == entry_package.key.length) {
                        id_fireup.push(entry.id);
                        keyup_buffer.splice(i, 1);
                        i--;
                    } else { // If it matches
                        entry.current = keycode;
                        entry.pass++;
                    }
                }
                // If not match
                else {
                    keyup_buffer.splice(i, 1);
                    i--;
                }
            }
            // Check new keycode
            if (this.hasProp(machine['start'], keycode)) {
                var id_array = first_to_id[keycode];
                var len = id_array.length;
                var timing;
                for (var i = 0; i < len; i++) {
                    // If only one keycode is enough, no need to push
                    if (keys_package[id_array[i]].key.length == 1) {
                        id_fireup.push(id_array[i]);
                        continue;
                    }
                    timing = keys_package[id_array[i]].time;
                    keyup_buffer.push(this.makeup_keyup_obj(keycode, id_array[i], _this));
                    // If user setup a time, destroy the sequence when time is up
                    if (timing) {
                        this.timer(timing, id_array[i], i, _this);
                    }
                }
            }
            // Any callback needs to be fired
            if (id_fireup.length > 0) {
                this.fire(id_fireup, _this);
            }
        },
        count: function(keys, _this) {
            var count = 0;
            var keys_package = _this.keys_package;
            var size_table = _this.size_table;
            var keys_array = this.string_to_array(keys);
            var id_array = size_table[keys_array.length];
            if (this.is_empty(keys_package) || id_array == void 0) {
                return count;
            }
            var len = id_array.length;
            var id;
            for (var i = 0; i < len; i++) {
                id = id_array[i];
                if (this.same_array(keys_array, keys_package[id].key)) {
                    count = keys_package[id].count;
                    return count;
                }
            }
            return count;
        }
    };

    //========================================================================================
    var Input = {};

    Input.Listener = (function() {
        function Input(element) {
            this.active_keys = {};
            this.keys_package = {};
            this.size_table = {};
            this.first_to_id = {};
            this.machine = {};
            this.keydown_buffer = [];
            this.keyup_buffer = [];
            element = element || document.body;
            Private.cross_browser();
            Private.attach_event(element, 'keyup', (function(_this) {
                return function(event) {
                    return _this.user_input(event, false);
                }
            })(this));
        }

        Input.extend = function(obj) {
            for (var i in obj) {
                Input.prototype[i] = obj[i];
            }
        }

        Input.extend({
            unordered_combo: function(keys, callback, time) {
                Private.add_combo(keys, callback, time, false, this);
            },

            ordered_combo: function(keys, callback, time) {
                Private.add_combo(keys, callback, time, true, this);
            },

            delete_combo: function(keys) {
                Private.destroy_combo(keys, this);
            },

            delete_all: function() {
                Private.destroy_all(this);
            },

            user_input: function(event, key_down) {
                var key_code = event.keyCode;
                if (key_down) {
                    Private.fire_keydown(key_code, this);
                } else {
                    Private.fire_keyup(key_code, this);
                }
            },

            count_times: function(keys) {
                return Private.count(keys, this);
            },
            get_keypackage: function() {
                //
                //    Object {
                //     "21": {
                //           callback: function(){},
                //           keep_fire: false,
                //           key: ["A","S"],
                //           key_origin: "a s",
                //           order: true;
                //           time: undefined,
                //      }
                //    }
                return this.keys_package;
            },

            get_sizetable: function() {
                //
                //     Object { 2: ["21"], }
                //
                return this.size_table;
            },

            get_activekeys: function() {
                //
                //     Object {65: 2, 83: 3}
                //
                return this.active_keys;
            },

            get_id: function() {
                //
                //     Object { 123 : ["21","23"],}
                //
                return this.first_to_id;
            },

            get_machine: function() {
                //
                //     Object {
                //        65: {
                //           66: 1,
                //           67: 1,
                //           83: 2, 
                //        }
                //        'start': {
                //           65: 1,
                //        }
                //     }
                //
                return this.machine;
            },
            get_buffer: function() {
                // 
                //    Object {
                //       current: 123,
                //       id: "21",
                //       pass: 4,
                //       v: true,
                //    }
                // 
                return this.keyup_buffer;
            }
        });
        return Input;
    })();
    //===========================================================================
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = Input;
    } else if (typeof define === 'function' && define.amd) {
        define([], function() {
            return Input;
        });
    } else {
        window.Input = Input;
    }
})()