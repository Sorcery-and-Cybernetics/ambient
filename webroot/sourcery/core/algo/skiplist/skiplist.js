//*************************************************************************************************
// skiplist - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("skiplist", function(_) {    
    _.define.core.linkedlist("core.skiplist", function (supermodel) {
        this.__upsegment = null;
        this.__topsegment = null;

        this.__level = 1;
        this.__segmentsize = 8;
        this.__segmentlevel = 8;

        this.__issortlist = false;

        this.objectbehavior = _.behavior(function() {
            this.construct = function() {
                this.__nextnode = this;
                this.__prevnode = this;

                this.__upsegment = _.make.core.skiplistsegment(this, this.__segmentlevel);
            };
        });

        this.skiplistnavigationbehavior = _.behavior(function() {
            this.isroot = function () { return true; };
            this.base = function () { return this; };
            this.segmenttop = function () { return this.__topsegment; };

            this.segmentnext = function () {
                return this.__nextnode;
            };
            
            this.segmentprev = function () { 
                return this.__prevnode;
            };

            this.segmentdown = function () { 
                return null;
            };

            this.segmentup = function () { 
                return this.__upsegment || undefined;
            };
        });

        this.skiplistbehavior = _.behavior(function() {
            this.__makenode = function(item) {
                if (item instanceof _.make.skiplistnode) { return item; } 
                return _.make.linkedlistnode(item);
            };

            this.issortlist = function(value) {
                if (value === undefined) { return this.__issortlist; }

                if (this.__issortlist != value) {
                    if (this.count() > 0) { throw "Cannot change list type after adding nodes"; }
                    this.__issortlist = value;
                }
                return this;
            };

            this.isorderlist = function() {
                return !this.__issortlist;
            };

            this.segmentsize = function(value) { 
                if (value === undefined) { return this.__segmentsize; }
                
                if (value >= 2) { 
                    this.__segmentsize = value;
                }
                return this;
            };

            this.segmentlevel = function(value) { 
                if (value === undefined) { return this.__segmentlevel; }

                if (value > this.__segmentlevel) { 
                    this.__segmentlevel = value;
                    _.make.skiplistsegment(this, value - 1);
                }
                return this;
            };

            this.nodebyindex = function(index) {
                return this.segmenttop().nodebyindex(index);
            };

            this.findnode = function(search, relativeindex) {
                return this.segmenttop().findnode(search, relativeindex);
            };
        });   
        
        this.debugbehavior = _.behavior(function() {
            this.debugout = function () {
                var result = [];

                this.foreach(function(node) {
                    result.push(node.value());
                });
        
                return result;
            };

            this.debugvalidate = function() {
                var errors = [];
                var cursor = this.firstnode();
                var count = 0;

                var errors = supermodel.debugvalidate.call(this) || [];

                while (cursor && cursor != this) {
                    var result = cursor.debugvalidate();

                    if (result) { errors.concat(result); }
                    cursor = cursor.nextnode();
                }

                var segment = this.__upsegment;
                var segmentlevel = 1;

                while (segment) {
                    var cursor = segment;
                    var count = 0;

                    do {
                        count += cursor.__childcount;
                        cursor = cursor.segmentnext();
                    } while (!cursor.isroot());

                    if (count != this.count()) { errors.push("Segment level " + segmentlevel + " childcount mismatch: " + count + ", expected: " + this.count()); }
                    segmentlevel += 1;
                    segment = segment.segmentup();
                }

                return errors.length? errors : undefined;
            };
        });            
    });
})