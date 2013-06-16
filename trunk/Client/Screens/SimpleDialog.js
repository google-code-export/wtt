// controla que parte da história o personagem ta pra aparecer na tela nas horas tais
var ChatDialog = me.HUD_Object.extend(
    {
        init:function (x, y, texto, titulo, callback,hudMode) {
            if (texto == undefined) return;
            this.callback = callback;
            this.ultimaLetra = false;
            this.posicao = 0;
            this.hudMode = hudMode;
            this.desenhando = 0;
            this.modX = 0;
            this.modXY = 0;
            if(hudMode==false) {
                this.modX = 30;
                this.modXY = gameH-64-10;
            }
            this.textSpeed = 40;
            this.normalTextSpeed = 40;
            this.nextPage = false;
            this.nextPageAnim = true;
            this.canSpeed = true;
            this.rollingPage = false;
            this.rollSize = 15;
            this.rollNow = 0;
            this.textY = 0;
            this.hideRows = 0;
            this.lockUltima = false;
            this.clear = 0;
            this.linhaEscrita = 0;
            this.linhas = new Array();
            this.font = new me.Font("Arial", 8, "black", "top");
            this.titulo = titulo;
            var ct = 0;
            var linhaAtual = "";
            while (ct < texto.length) {
                if (texto[ct] == "#") {
                    this.linhas.push(linhaAtual);
                    linhaAtual = "";
                } else {
                    linhaAtual += texto[ct];
                }
                ct++;
            }
            this.linhas.push(linhaAtual);
            this.janela = null;

            // call the parent constructor
            this.parent(x, y);
            // create a font
            // this.font = new me.BitmapFont("16x16_font", 16);
        },

        update: function() {
            this.parent();
        },

        draw:function (ctx, x, y) {
            if (me.input.isKeyPressed('main')) {
                if (this.nextPage && this.canSpeed) {
                    if (this.desenhando == this.linhas.length) {
                        //me.game.HUD.removeItem("caixaTexto");
                        //me.game.HUD.updateItemValue("caixaTexto", 0);
                        paralizado = false;
                        this.clear = 1;
                    }
                    this.rollingPage = true;
                    this.canSpeed = false;
                    this.hideRows++;
                } else {
                    this.textSpeed = 2;
                    // this.canSpeed = false;
                }

            }
            if (this.clear == 1) {
                this.clear = 2;
            } else if (this.clear == 2) {
                if(this.hudMode==undefined || this.hudMode==true) {
                    me.game.HUD.removeItem("caixaTexto");
                    me.game.disableHUD();
                } else {
                    me.game.remove(this);
                }
                if(this.callback != undefined && this.callback.run==undefined)
                    this.callback();
                else if(this.callback != undefined && this.callback.run != undefined)
                    this.callback.run();
                this.clear =3;
            } else if(this.clear == 3) {

            } else {

                if (this.janela == null) {
                    this.janela = me.loader.getImage("WoodTexture");
                    this.ultimaLetra = new Date().getTime() / this.textSpeed;
                }
                ctx.drawImage(this.janela, 0+this.modX, 0+this.modXY, 260, 64);


                if (this.titulo != undefined) {
                    this.font.set('Arial', 14, 'black');
                    this.font.draw(ctx, this.titulo + ":", 7+this.modX, 3+this.modXY);

                    this.font.set('Arial', 14, 'red');
                    this.font.draw(ctx, this.titulo + ":", 8+this.modX, 4+this.modXY);
                }

                var ct = 0;
                this.font.set('Arial', 12, 'black');
                var desenhadas = 0;
                while (desenhadas < this.desenhando) {
                    if (desenhadas >= this.hideRows)
                        this.font.draw(ctx, this.linhas[desenhadas], 10+this.modX, 16 * (desenhadas + 1) + this.textY +this.modXY);
                    desenhadas++;
                }
                if (this.rollingPage) {
                    var lastLineDraw = desenhadas;
                    var totalLines = this.linhas.length;
                    if (this.rollNow > this.rollSize) {
                        this.rollingPage = false;
                        this.nextPage = false;
                        this.posicao = 1;
                        this.rollNow = 0;
                        this.ultimaLetra = new Date().getTime() / this.textSpeed;
                        this.lockUltima = true;
                        this.canSpeed = true;

                    } else {
                        this.textY = this.textY - 1;
                        this.rollNow = this.rollNow + 1;
                    }


                } //else {
                if (this.lockUltima && this.desenhando < this.linhas.length)
                    this.font.draw(ctx, this.linhas[this.desenhando].substring(0, this.posicao), 10+this.modX, (16 * (3) - 1)+this.modXY);
                else if (this.desenhando < this.linhas.length)
                    this.font.draw(ctx, this.linhas[this.desenhando].substring(0, this.posicao), 10+this.modX, (16 * (this.desenhando + 1))+this.modXY);
                if (this.nextPage == true) {
                    if (this.ultimaLetra + 5 < new Date().getTime() / this.textSpeed) {
                        this.ultimaLetra = new Date().getTime() / this.textSpeed;
                        if (this.nextPageAnim) {
                            this.nextPageAnim = false;
                        } else {
                            this.nextPageAnim = true;
                        }
                    }
                    if (!this.rollingPage) {
                        if (this.nextPageAnim) {
                            ctx.fillStyle = "black";
                            ctx.fillRect(240+this.modX, 42+this.modXY, 11, 12);

                            ctx.fillStyle = "white";
                            ctx.fillRect(241+this.modX, 43+this.modXY, 9, 10);

                            ctx.fillStyle = "black";
                            ctx.fillRect(240+this.modX, 52+this.modXY, 11, 5);

                            ctx.fillStyle = "white";
                            ctx.fillRect(241+this.modX, 53+this.modXY, 9, 3);

                            this.font.set('Verdana', 10, 'black');
                            this.font.draw(ctx, PlayerConfiguration.mainButton, 242+this.modX, 43+this.modXY);
                        } else {
                            ctx.fillStyle = "black";
                            ctx.fillRect(240+this.modX, 42 + 4+this.modXY, 11, 12);

                            ctx.fillStyle = "white";
                            ctx.fillRect(241+this.modX, 43 + 4+this.modXY, 9, 10);

                            this.font.set('Verdana', 10, 'black');
                            this.font.draw(ctx, PlayerConfiguration.mainButton, 242+this.modX, 43 + 4+this.modXY);
                        }
                    }

                } else {
                    if (this.linhas[this.desenhando] == undefined) {
                        this.nextPage = true;
                        this.textSpeed = this.normalTextSpeed;
                        this.ultimaLetra = new Date().getTime() / this.textSpeed;
                        return;
                    }
                    if (this.ultimaLetra + 1 < new Date().getTime() / this.textSpeed) {
                        this.ultimaLetra = new Date().getTime() / this.textSpeed;
                        if (this.posicao < this.linhas[this.desenhando].length) {
                            this.posicao++;
                        } else {
                            //this.canSpeed = true;
                            //if(desenhando==this.linhas.length) {

                            //}
                            if (desenhadas < 2 && desenhadas < this.linhas.length) {
                                this.desenhando++;
                                this.posicao = 0;
                            } else {
                                this.textSpeed = this.normalTextSpeed;
                                this.ultimaLetra = new Date().getTime() / this.textSpeed;
                                this.nextPage = true;
                                this.posicao = 0;
                                if (this.desenhando != this.linhas.length)
                                    this.desenhando++;
                                //else
                                //alert("lockei em "+this.desenhando);
                            }
                        }
                    }
                }
            }
        }
    });