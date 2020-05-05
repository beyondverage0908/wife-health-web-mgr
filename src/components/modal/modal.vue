<template>
    <div v-transfer-dom :data-transfer="transfer">
        <transition :name="transitionNames[1]">
            <div
                :class="maskClasses"
                v-show="visible"
                v-if="showMask"
                @click="handleMask"
                :style="wrapStyles"
            ></div>
        </transition>
        <div :class="wrapClasses" :style="wrapStyles" @click="handleWrapClick">
            <transition :name="transitionNames[0]" @after-leave="animationFinish">
                <div :class="classes" :style="mainStyles" v-show="visible">
                    <div :class="contentClasses" ref="content" @click="handleClickModal">
                        <slot></slot>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import TransferDom from './directives/transfer-dom';
import Emitter from './mixins/emitter';
import ScrollbarMixins from './mixins-scrollbar';
// import { on, off } from './utils';
import { modalIndex, modalIncrease } from './q';

const prefixCls = 'ivu-modal';

export default {
    name: 'Modal',
    mixins: [Emitter, ScrollbarMixins],
    // components: { Icon, iButton },
    directives: { TransferDom },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        closable: {
            type: Boolean,
            default: true
        },
        maskClosable: {
            type: Boolean,
            default: true
        },
        title: {
            type: String
        },
        width: {
            type: [Number, String],
            default: 520
        },
        okText: {
            type: String
        },
        cancelText: {
            type: String
        },
        loading: {
            type: Boolean,
            default: false
        },
        styles: {
            type: Object
        },
        className: {
            type: String
        },
        // for instance
        footerHide: {
            type: Boolean,
            default: false
        },
        scrollable: {
            type: Boolean,
            default: false
        },
        transitionNames: {
            type: Array,
            default() {
                return ['ease', 'fade'];
            }
        },
        transfer: {
            type: Boolean,
            default() {
                return !this.$IVIEW || this.$IVIEW.transfer === '' ? true : this.$IVIEW.transfer;
            }
        },
        fullscreen: {
            type: Boolean,
            default: false
        },
        mask: {
            type: Boolean,
            default: true
        },
        draggable: {
            type: Boolean,
            default: false
        },
        zIndex: {
            type: Number,
            default: 800
        }
    },
    data() {
        return {
            prefixCls,
            wrapShow: false,
            buttonLoading: false,
            visible: this.value,
            dragData: {
                x: null,
                y: null,
                dragX: null,
                dragY: null,
                dragging: false
            },
            modalIndex: this.handleGetModalIndex() // for Esc close the top modal
        };
    },
    computed: {
        wrapClasses() {
            return [
                `${prefixCls}-wrap`,
                {
                    [`${prefixCls}-hidden`]: !this.wrapShow,
                    [`${this.className}`]: !!this.className,
                    [`${prefixCls}-no-mask`]: !this.showMask
                }
            ];
        },
        wrapStyles() {
            return {
                zIndex: this.modalIndex + this.zIndex
            };
        },
        maskClasses() {
            return `${prefixCls}-mask`;
        },
        classes() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-fullscreen`]: this.fullscreen,
                    [`${prefixCls}-fullscreen-no-footer`]: this.fullscreen && this.footerHide
                }
            ];
        },
        contentClasses() {
            return [
                `${prefixCls}-content`,
                {
                    [`${prefixCls}-content-no-mask`]: !this.showMask,
                    [`${prefixCls}-content-drag`]: this.draggable,
                    [`${prefixCls}-content-dragging`]: this.draggable && this.dragData.dragging
                }
            ];
        },
        mainStyles() {
            const style = {};
            style.top = '50px';
            const width = parseInt(this.width);
            const styleWidth
                = this.dragData.x !== null
                    ? {
                          top: 0
                      }
                    : {
                          width: width <= 100 ? `${width}%` : `${width}px`
                      };

            const customStyle = this.styles ? this.styles : {};

            Object.assign(style, styleWidth, customStyle);

            return style;
        },

        showMask() {
            return this.draggable ? false : this.mask;
        }
    },
    methods: {
        close() {
            this.visible = false;
            this.$emit('input', false);
            this.$emit('on-cancel');
        },
        handleMask() {
            if (this.maskClosable && this.showMask) {
                this.close();
            }
        },
        handleWrapClick(event) {
            // use indexOf,do not use === ,because ivu-modal-wrap can have other custom className
            const className = event.target.getAttribute('class');
            if (className && className.indexOf(`${prefixCls}-wrap`) > -1) {
                this.handleMask();
            }
        },
        cancel() {
            this.close();
        },
        ok() {
            if (this.loading) {
                this.buttonLoading = true;
            } else {
                this.visible = false;
                this.$emit('input', false);
            }
            this.$emit('on-ok');
        },
        animationFinish() {
            this.$emit('on-hidden');
        },
        handleGetModalIndex() {
            modalIncrease();
            return modalIndex;
        },
        handleClickModal() {
            this.modalIndex = this.handleGetModalIndex();
        }
    },
    mounted() {
        if (this.visible) {
            this.wrapShow = true;
        }
        // ESC close
        document.addEventListener('keydown', this.EscClose);
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.EscClose);
        this.removeScrollEffect();
    },
    watch: {
        value(val) {
            this.visible = val;
        },
        visible(val) {
            if (val === false) {
                this.buttonLoading = false;
                this.timer = setTimeout(() => {
                    this.wrapShow = false;
                    this.removeScrollEffect();
                }, 300);
            } else {
                this.modalIndex = this.handleGetModalIndex();

                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.wrapShow = true;
                if (!this.scrollable) {
                    this.addScrollEffect();
                }
            }
            this.broadcast('Table', 'on-visible-change', val);
            this.broadcast('Slider', 'on-visible-change', val); // #2852
            this.$emit('on-visible-change', val);
        },
        loading(val) {
            if (!val) {
                this.buttonLoading = false;
            }
        },
        scrollable(val) {
            if (!val) {
                this.addScrollEffect();
            } else {
                this.removeScrollEffect();
            }
        }
    }
};
</script>
