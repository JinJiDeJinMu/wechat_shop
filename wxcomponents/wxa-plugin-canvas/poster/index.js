Component({
    properties: {
        config: {
            type: Object,
            value: {},
			observer(value) {
				if (value != null&&value!='undefined') {
					this.initData(value);
				}
			}
        },
        preload: {  // 是否预下载图片资源
            type: Boolean,
            value: false,
        },
        hideLoading: {  // 是否隐藏loading
            type: Boolean,
            value: false,
        }
    },
	watch: {
	   config: function(value){
	      console.log(value);
	    }
	},
    ready() {
        if (this.data.preload&&this.data.config!=null) {
         this.initData(this.data.config);
        }
    },
    methods: {
		initData(value) {
			const poster = this.selectComponent('#poster');
			this.downloadStatus = 'doing';
			
			poster.downloadResource(value).then(() => {
			    this.downloadStatus = 'success';
			    this.trigger('downloadSuccess');
			}).catch((e) => {
			    this.downloadStatus = 'fail';
			    this.trigger('downloadFail', e);
			});
		},
        trigger(event, data) {
            if (this.listener && typeof this.listener[event] === 'function') {
                this.listener[event](data);
            }
        },
        once(event, fun) {
            if (typeof this.listener === 'undefined') {
                this.listener = {};
            }
            this.listener[event] = fun;
        },
        downloadResource(reset) {
            return new Promise((resolve, reject) => {
                if (reset) {
                    this.downloadStatus = null;
                }
                const poster = this.selectComponent('#poster');
                if (this.downloadStatus && this.downloadStatus !== 'fail') {
                    if (this.downloadStatus === 'success') {
                        resolve();
                    } else {
                        this.once('downloadSuccess', () => resolve());
                        this.once('downloadFail', (e) => reject(e));
                    }
                } else {
					if(this.data.config!=null){
                    poster.downloadResource(this.data.config)
                        .then(() => {
                            this.downloadStatus = 'success';
                            resolve();
                        })
                        .catch((e) => reject(e));
						}
						else{
							console.log('配置为空');
						}
                }  
            })
        },
        onCreate(reset = false) {
            !this.data.hideLoading && wx.showLoading({ mask: true, title: '生成中' });
            return this.downloadResource(typeof reset === 'boolean' && reset).then(() => {
                !this.data.hideLoading && wx.hideLoading();
                const poster = this.selectComponent('#poster');
                poster.create(this.data.config);
            })
            .catch((err) => {
                !this.data.hideLoading && wx.hideLoading();
                wx.showToast({ icon: 'none', title: err.errMsg || '生成失败' });
                console.error(err);
                this.triggerEvent('fail', err);
            })
        },
        onCreateSuccess(e) {
            const { detail } = e;
            this.triggerEvent('success', detail);
        },
        onCreateFail(err) {
            console.error(err);
            this.triggerEvent('fail', err);
        }
    }
})