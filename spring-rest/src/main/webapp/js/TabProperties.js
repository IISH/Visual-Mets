    this.id = id;
    this.page = 1;
    this.pageCount = 10;
    this.rotation = 0;
    this.zoom = 100;
    this.metsId = 1;
    this.brightness = 0;
    this.contrast = 1;
    this.title = '';
    this.overview = true;
    this.thumbnailList = new Array();
    this.thumbnailZoom = 0;
    this.overviewPage = 1;
    this.breadcrumb = '';

    this.reset = function(){
        this.rotation = 0;
        this.zoom = 100;
        this.brightness = 0;
        this.contrast = 1;
        $("#editButtons_" + id + " #brightnessSlider").slider("option","value",0);
        $("#editButtons_" + id + " #contrastSlider").slider("option","value",1);
    }

    this.zoomIn = function(){
        this.zoom += 5;
        return this.zoom;
    }

    this.zoomOut = function(){
        this.zoom -= 5;
        return this.zoom;
    }

    this.rotateCCW = function(){
        this.rotation = (this.rotation - 90) % 360;
    }

    this.rotateCW = function(){
        this.rotation = (this.rotation + 90) % 360;
    }


    this.gotoPage = function(page){
        this.page = page;
    }

    this.firstPage = function(){
        this.page = 1;
        return 1;
    }
    this.prevPage = function(){
        if(this.page > 1){
            this.page--;
            return this.page;
        } else {
            return 1;
        }
    }

    this.nextPage = function(){
        if(this.page < this.pageCount){
            this.page++;
            return this.page;
        } else {
            return this.page;
        }
    }

    this.lastPage = function(){
        this.page = this.pageCount;
        return this.pageCount;
    }

