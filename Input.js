(function () {
	var KEYS = {
      BACKSPACE : 8, 
      TAB       : 9,
      CLEAR     : 12, // Mac keyboard
      ENTER     : 13,
      SHIFT     : 16,
      CTRL      : 17,
      ALT       : 18,
      CAPS      : 20,
      ESC       : 27,
      SPACE     : 32,
      PAGE_UP   : 33,
      PAGE_DOWN : 34,
      END       : 35,
      HOME      : 36,
      //////////////////////
      LEFT   : 37,
      UP     : 38,
      RIGHT  : 39,
      DOWN   : 40,
      INSERT : 45,
      DELETE : 46,
      //////////////////////
      ZERO  : 48,
      ONE   : 49,
      TWO   : 50,
      THREE : 51,
      FOUR  : 52,
      FIVE  : 53,
      SIX   : 54,
      SEVEN : 55,
      EIGHT : 56,
      NINE  : 57,
      //////////////////////
      A : 65, 
      B : 66, 
      C : 67,
      D : 68, 
      E : 69, 
      F : 70,
      G : 71, 
      H : 72, 
      I : 73,
      J : 74, 
      K : 75, 
      L : 76,
      M : 77, 
      N : 78, 
      O : 79,
      P : 80, 
      Q : 81, 
      R : 82,
      S : 83, 
      T : 84, 
      U : 85,
      V : 86, 
      W : 87, 
      X : 88,
      Y : 89, 
      Z : 90,

      L_START : 91, // usual keyboard
      R_START : 92,
      L_CMD   : 91, // Mac's keyboard
      R_CMD   : 93,
      MENU_KEY: 93, // Detected on laptop keyboard
      N_ZERO  : 96,
      N_ONE   : 97,
      N_TWO   : 98,
      N_THREE : 99,
      N_FOUR  : 100,
      N_FIVE  : 101,
      N_SIX   : 102,
      N_SEVEN : 103,
      N_EIGHT : 104,
      N_NINE  : 105,
      N_MULTI : 106,
      N_PLUS  : 107,
      N_MINUS : 109,
      N_PERIOD: 110,
      N_DEVIDE: 111,
      N_LOCK  : 144,

      SEMICOLON : 186,  // ;
      EQUAL     : 187,  // =
      COMMA     : 188,  // ,
      MINUS     : 189,  // -
      PERIOD    : 190,  // .
      SLASH     : 191,  // /
      BACKTICK  : 192,  // `
      L_BRACKET : 219,  // [
      BACKSLASH : 220,  // \
      R_BRACKT  : 221,  // ]
      S_QUOTE   : 222,  // '
	  };
    
    var State_Machine = {

      add: function(machine,keys_array) {  // id array
           if(machine['start'] == void 0) {
                machine['start'] = {};
           }
           if(machine['start'][KEYS[keys_array[0]]]) {
              machine['start'][KEYS[keys_array[0]]]++;
           }
           else { 
              machine['start'][KEYS[keys_array[0]]] = 1;
           }
           var len = keys_array.length;
           var key, value;
           for(var i = 0; i < len - 1; i++) {
                key = KEYS[keys_array[i]];
                value = KEYS[keys_array[i+1]];
                if(machine[key] == void 0) {
                   machine[key] = {};
                }
                if(machine[key][value]) {
                     machine[key][value]++;
                }
                else { 
                  machine[key][value] = 1;
                }
           }
      }
    };
    
    //=====================================================================================
    var Private = {
      is_string:   function(obj) {
                     return Object.prototype.toString.call(obj) === "[object String]";
                   },

      is_boolean:  function(obj) {
                    return Object.prototype.toString.call(obj) === "[object Boolean]";
                   },

      is_function: function(obj) {
                    return Object.prototype.toString.call(obj) === '[object Function]';
                   },

      is_undefined: function(obj) {
                    return obj === void 0;
                   },

      is_empty:    function(obj) { // Test if something is {} or [] not
                     if(obj == null) return true;
                     if(obj.length > 0) return false;
                     if(obj.length === 0) return true; 
                     for (var key in obj) {
                         if(this.hasProp(obj,key)) {
                           return false;
                         }
                      }
                      return true;
                   },

      same_array:  function(first, second) {
                      if(first.length !== second.length) return false;
                      var len = first.length;
                      for(var i = 0; i < len; i++) {
                          if(first[i] !== second[i]) return false;
                      }
                      return true;
                   },

      hasProp:     function(obj, prop) {
                      return Object.prototype.hasOwnProperty.call(obj, prop);
                    },

      string_to_array: function(obj) {
                     var ret = obj.toUpperCase().replace(/\s+/g,' ').split(" ");
                     for(var i = 0; i < ret.length; i++) {
                         if(ret[i] == "") {
                           ret.splice(i, 1);
                         }
                     }
                     return ret;
                   },

      string_to_object: function(obj) {
                     var ret = {};
                     var array = this.string_to_array(obj);
                     var len = array.length;
                     for(var i = 0; i < len; i++) {
                         if(ret[array[i]]) {
                            ++ret[array[i]];
                         }else {
                            ret[array[i]] = 1;
                         }
                     }
                     return ret;
                   },

      attach_event: function(element, event, callback) {
                     if(document.addEventListener){
                        element.addEventListener(event, callback);
                     }else if(document.attachEvent) {
                        element.attachEvent("on" + event, callback);
                     }   
                   },

      register_keys: function(keys_array, _this) {
                       var len = keys_array.length;
                       for (var i = 0; i < len; i++) {
                          if(KEYS[keys_array[i]] === void 0) {
                              throw "Not support " + keys_array[i];
                          }
                          if(_this.active_keys[KEYS[keys_array[i]]]) {
                             _this.active_keys[KEYS[keys_array[i]]]++;
                          }
                          else {
                             _this.active_keys[KEYS[keys_array[i]]] = 1;
                          }
                       }
                     },

      keys_to_keycode: function(keys) {
                         var keycode = "";
                         var keys_array = string_to_array(keys);
                         var len = keys_array.length;
                         for(var i = 0; i < len; i++) {
                             if(i == len - 1) {
                                 keycode += keys_array[i];
                             }
                             else {
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
                         if(s_table[size]) {
                            var len = s_table[size].length;
                            var last = s_table[size][len - 1];
                            id = size.toString() + (parseInt(last.substr(1,last.length - 1)) + 1);
                            s_table[size].push(id); 
                         }
                         else {
                            id = size.toString() + 1;
                            s_table[size] = [id];
                         }
                         return id;
                      },

      store_keypackage: function(keys,ordered,callback,time,id,_this) {
                         var _package = {};
                         if(ordered) {
                            var key_array = this.string_to_array(keys);
                            _package.key = key_array;
                         }
                         else {
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

      add_to_first:  function(first,id,_this) {
                       var first_to_id = _this.first_to_id;
                       if(first_to_id[first] == void 0) {
                          first_to_id[first] = [];
                       }
                       first_to_id[first].push(id);
                     },

      add_combo:    function(keys, callback, time, ordered, _this) {
                      if(!this.is_string(keys)) {
                           throw "function(ordered_combo) expects \"keys\" to be string";
                      }              
                      if(!this.is_function(callback)) {
                           throw "function(ordered_combo) expects \"callback\" to be function";
                      }  
                      var keys_array = this.string_to_array(keys);
                      if(this.is_empty(keys_array)) {
                           return;
                      }
                      this.register_keys(keys_array, _this);
                      var id = this.store_sizetable(keys_array.length, _this);
                      this.store_keypackage(keys,ordered,callback,time,id,_this);
                      if(ordered) {
                         this.add_to_first(KEYS[keys_array[0]],id,_this);
                         State_Machine.add(_this.machine, keys_array);
                      }                           
                    },

      remove_firstoid: function(key, id, _this) {
                       var id_array = _this.first_to_id[key];
                       var len = id_array.length;
                       for(var i = 0; i < len; i++) {
                           if(id_array[i] == id) {
                              id_array.splice(i,1);
                              return;
                           }
                       }
                    },

      remove_package: function(keys_array, _this) {
                       var keys_package = _this.keys_package;
                       if(this.is_empty(keys_package)) { // If nothing to remove
                           return false;
                       }
                       var size_table = _this.size_table;
                       var id_array = size_table[keys_array.length];
                       var len = id_array.length;
                       var id;
                       for(var i = 0; i < len; i++) {
                           id = id_array[i];
                           if(this.same_array(keys_array, keys_package[id].key)) {
                                size_table[keys_array.length].splice(i,1);
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
                            for(var i = 0; i < len; i++) {
                                if(active_keys[KEYS[keys_array[i]]] == 1) {
                                   delete active_keys[KEYS[keys_array[i]]];
                                   continue;
                                }
                                active_keys[KEYS[keys_array[i]]]--;
                            }
                         },
      
      remove_machine: function(keys_array, _this) {
                         var machine = _this.machine;
                         var len = keys_array.length;
                         var keycode, value;
                         keycode = KEYS[keys_array[0]];
                         if(machine['start'][keycode] == 1) {
                            delete machine['start'][keycode];
                         }
                         else {
                            machine['start'][keycode]--;
                         }
                         for(var i = 0; i < len - 1; i++) {
                            keycode = KEYS[keys_array[i]];
                            value = KEYS[keys_array[i+1]];
                            if(machine[keycode][value] == 1) {
                               delete machine[keycode][value];
                            }
                            else {
                               machine[keycode][value]--;
                            }
                         }
                      },

      destroy_combo: function(keys, _this) {
                       var keys_array = this.string_to_array(keys); //["A", "S"]
                       if(this.remove_package(keys_array, _this)) {
                          this.remove_activekeys(keys_array, _this);
                          this.remove_machine(keys_array, _this);
                       }
                    },

      makeup_keyup_obj: function(current,id, _this) {
                          var obj = {};
                          obj["current"] = current;
                          obj["id"] = id;
                          obj["pass"] = 1;
                          obj["v"] = true;
                          return obj;
                       },

      timer:        function(timeup,id,position, _this) {
                        setTimeout((function(__this){
                           return function() {
                               var buffer = _this.keyup_buffer;
                               if(__this.is_empty(buffer)) { return; } // If buffer is cleared before timeup
                               for(var i = 0; i <= position; i++) {
                                  if(__this.is_empty(buffer)) { return; } // If buffer is cleared during this stage
                                  if(id == buffer[i].id) {
                                      buffer[i].v = false;  
                                      return;
                                  }
                                }
                            }
                        })(this),timeup);
                    },
       
      fire:         function(id_array, _this) {
                       var keys_package = _this.keys_package;
                       var len = id_array.length;
                       var func;
                       for(var i = 0; i < len; i++) {
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
                      if(!this.hasProp(_this.active_keys, keycode)) {
                          _this.keyup_buffer = [];
                          return;
                      }
                      var keyup_buffer = _this.keyup_buffer;
                      var keys_package = _this.keys_package;
                      var first_to_id = _this.first_to_id;
                      var machine = _this.machine;
                      var id_fireup = [];
                      var entry;
                      for(var i = 0; i < keyup_buffer.length; i++) {
                          entry = keyup_buffer[i];
                          // If no longer valid
                          if(!entry.v) {
                             keyup_buffer.splice(i,1);
                             i--;
                             continue;
                          }
                          // If match
                          if(this.hasProp(machine[entry.current], keycode)) {
                              // If the last one
                              if(entry.pass + 1 == keys_package[entry.id].key.length) {
                                 id_fireup.push(entry.id);
                                 keyup_buffer.splice(i,1);
                                 i--;     
                              }
                              else { // If it matches
                                 entry.current = keycode;
                                 entry.pass++;
                              }
                          }
                          // If not match
                          else { 
                            keyup_buffer.splice(i,1);
                            i--;
                          }
                      }
                      // Check new keycode
                      if(this.hasProp(machine['start'],keycode)) {
                           var id_array = first_to_id[keycode];
                           var len = id_array.length;
                           var timing;
                           for(var i = 0; i < len; i++) {
                              // If only one keycode is enough, no need to push
                              if(keys_package[id_array[i]].key.length == 1) {
                                id_fireup.push(id_array[i]);
                                continue; 
                              }
                              timing = keys_package[id_array[i]].time;
                              keyup_buffer.push(this.makeup_keyup_obj(keycode, id_array[i], _this));
                              // If user setup a time, destroy the sequence when time is up
                              if(timing) {
                                  this.timer(timing,id_array[i],i,_this);
                              }
                           }
                      }
                      // Any callback needs to be fired
                      if(id_fireup.length > 0) {
                           this.fire(id_fireup,_this);
                      }
                   },
          count:   function(keys, _this) {
                       var count = 0;
                       var keys_package = _this.keys_package;
                       var size_table = _this.size_table;
                       var keys_array = this.string_to_array(keys);
                       var id_array = size_table[keys_array.length];      
                       if(this.is_empty(keys_package) || id_array == void 0) { 
                           return count;
                       }
                       var len = id_array.length;
                       var id;
                       for(var i = 0; i < len; i++) {
                           id = id_array[i];
                           if(this.same_array(keys_array, keys_package[id].key)) {
                                count = keys_package[id].count;
                                return count;
                           }
                       }
                       return count;
                   },
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
           Private.attach_event(element, 'keyup', (function(_this) {
                  return function(event) {
                      return _this.user_input(event,false);
                  }
           })(this));
        }

        Input.extend = function(obj) {
        	for(var i in obj) {
        		Input.prototype[i] = obj[i];
        	}
        }

        Input.extend({
            unordered_combo:  function(keys, callback, time) {
                                Private.add_combo(keys, callback, time, false, this);
                              },

            ordered_combo:    function(keys, callback, time) {
                                Private.add_combo(keys, callback, time, true, this);
                              },

            delete_combo:     function(keys) {
                                Private.destroy_combo(keys, this);
                              },

            user_input:       function(event,key_down) { 
                                var key_code = event.keyCode;
                                if(key_down) {
                                   Private.fire_keydown(key_code, this);
                                }
                                else {
                                   Private.fire_keyup(key_code, this);
                                }                                
                              },

            count_times:      function(keys) {
                                 return Private.count(keys, this);
                              },
            get_keypackage :  function() {
                                 /*
                                     Object {
                                      "21": {
                                            callback: function(){},
                                            keep_fire: false,
                                            key: ["A","S"],
                                            key_origin: "a s",
                                            order: true;
                                            time: undefined,
                                       }
                                     }
                                 */
                                 return this.keys_package;
                              },

            get_sizetable  :  function() {
                                 /*
                                      Object { 2: ["21"], }
                                 */
                                 return this.size_table;
                              },

            get_activekeys :  function() {
                                 /*
                                      Object {65: true, 83: true}
                                 */
                                 return this.active_keys;
                              },

            get_id:           function() {
                                 /*
                                      Object { 123 : ["21","23"],}
                                 */
                                 return this.first_to_id;
                              },

            get_machine: function() {
                                 /*
                                      Object {
                                         65: {
                                            66: true,
                                            67: true,
                                            83: true, 
                                         }
                                         'start': {
                                            65: true,
                                         }
                                      }
                                 */
                                 return this.machine;
                              },
            get_buffer:  function() {
                                  /* 
                                      Object {
                                         current: 123,
                                         id: "21",
                                         pass: 4,
                                      }

                                 */
                                 return this.keyup_buffer;
            }
       });
       return Input;
    })();
	//===========================================================================
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Input;
  }
  else if (typeof define === 'function' && define.amd) {
    define([], function() { return Input; });
  }
  else {
    window.Input = Input;
  }
})()
