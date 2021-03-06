import { Component } from '@angular/core';

// declarando jQuery como global
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    // variáveis globais usadas no data biding
    nextStep = true;
    btnFinish = false;
    planID = 0;

    //variáveis das opções de planos de assinatura
    firstName = '';
    firstDesconto = '';
    secondName = '';
    secondDesconto = '';
    thirdName = '';
    thirdDesconto = '';
    valorTotal = '';
    valorCurrency = '';
    valorInteger = 0;
    valorDecimal = 0;
    valorPeriodo = '';

    creditoTexto = '';
    debitoTexto = '';
    boletoTexto = '';
    planDetails = '';

    constructor() {
        // função inicial para coletar os dados do json quando a página carrega (informações dos planos)
        var dataJson;

        $.ajax({
            dataType: 'json',
            method: 'GET',
            url: './assets/js/data.json',
            success: function( data ) {
                dataJson = data.plans;
            }
        });

        setTimeout(() => {
            this.firstName = dataJson[0].name;
            this.secondName = dataJson[1].name;
            this.thirdName = dataJson[2].name;
            $('#plano-1 .economize').html(dataJson[0].discount);
            $('#plano-2 .economize').html(dataJson[1].discount);
            $('#plano-3 .economize').html(dataJson[2].discount);

            this.valorCurrency = dataJson[this.planID].price.currency;
            this.valorInteger = dataJson[this.planID].price.integer;
            this.valorDecimal = dataJson[this.planID].price.decimal;
            this.valorPeriodo = dataJson[this.planID].price.periodicy;
            this.planDetails = dataJson[this.planID].details;

            $('.valor-total-container p').html(dataJson[this.planID].total);
            $('.pagamento-tipo.credito p').html(dataJson[this.planID].payments[0]);
            $('.pagamento-tipo.debito p').html(dataJson[this.planID].payments[1]);
            $('.pagamento-tipo.boleto p').html(dataJson[this.planID].payments[2]);
        }, 250);
    }

    choosePlanOption(event: any) {
        $('.opcao-box').removeClass('active');

        if ( (<HTMLInputElement>event.target).className == 'opcao-box' ) {
            (<HTMLInputElement>event.target).className += " active";
        } else if ( (<HTMLInputElement>event.target).className == 'percetage' ) {
            (<HTMLInputElement>event.target.parentElement.parentElement).className += " active";
        } else {
            (<HTMLInputElement>event.target.parentElement).className += " active";
        }

        var dataJson;
        this.planID = $('.opcao-box.active').attr('data-id');

        $.ajax({
            dataType: 'json',
            method: 'GET',
            url: './assets/js/data.json',
            success: function( data ) {
                dataJson = data.plans;
            }
        });

        setTimeout(() => {
            this.valorCurrency = dataJson[this.planID].price.currency;
            this.valorInteger = dataJson[this.planID].price.integer;
            this.valorDecimal = dataJson[this.planID].price.decimal;
            this.valorPeriodo = dataJson[this.planID].price.periodicy;
            this.planDetails = dataJson[this.planID].details;

            $('.valor-total-container p').html(dataJson[this.planID].total);
            $('.pagamento-tipo.credito p').html(dataJson[this.planID].payments[0]);
            $('.pagamento-tipo.debito p').html(dataJson[this.planID].payments[1]);
            $('.pagamento-tipo.boleto p').html(dataJson[this.planID].payments[2]);
        }, 250);
    }

    onNextStepClick() {
        // caso seja para avançar para o formulário do cartão
        if ( this.nextStep && !this.btnFinish ) {
            // mainBtn.remove("next").className += " finish";
            $('#payment-info').slideUp().next().slideDown();
            $('#steps-btn').text('Concluir minha assinatura');
            $('.plano-flow .flow-content:first-of-type').removeClass('active').next().addClass('active');

            this.nextStep = false;
            this.btnFinish = true;
        } else {
            // verifica os campos do cartão, validando cada campo
            var validateFlag = false;
            var msg = Array();
        	var tipo = null;
            var cardNumber = $('#card-number').val();
            var validadeMes = $('#validade-mes').val();
            var validadeAno = $('#validade-ano').val();
            var nomeTitular = $('#card-titular').val();
            var cardCode = $('#card-code').val();

            // limpa os erros de cada campo, para que não sejam mostrados caso ocorra uma nova tentativa
            $('.number .frm-error-wrapper').removeClass('has-error').children('.frm-error').text('Cartão inválidox').parent().parent().removeClass('has-error');
            $('.expiration .frm-error-wrapper').removeClass('has-error').children('.frm-error').text('Validade inválida').parent().parent().removeClass('has-error');
            $('.name .frm-error-wrapper').removeClass('has-error').children('.frm-error').text('Esse campo não pode estar vazio').parent().parent().removeClass('has-error');
            $('.code .frm-error-wrapper').removeClass('has-error').children('.frm-error').text('Código inválido').parent().parent().removeClass('has-error');
            $('.frm-error-wrapper.mobile').removeClass('has-error').children('.frm-error').text('Campos contém erros. Corrija e tente novamente');

            // validação do número do cartão: testa caso o campo seja vazio e verifica se o número é válido (bem como operadora caso precise)
            if ( cardNumber.length == 0 ) {
                msg.push("Esse campo não pode estar vazio");
                $('.number .frm-error-wrapper').addClass('has-error').children('.frm-error').text('Esse campo não pode estar vazio').parent().parent().addClass('has-error');
                $('.frm-error-wrapper.mobile').addClass('has-error').children('.frm-error').text('Campos contém erros. Corrija e tente novamente');
            } else if ( cardNumber.length > 16 || cardNumber[0] == 0 || cardNumber.length < 16) {

        		msg.push("Número de cartão inválido");

        	} else {

        		var total = 0, num = 0, dig = 0, dig1 = '', dig2 = '';
                var operadora = '';
        		var arr = Array();

        		for ( var i = 0; i < cardNumber.length; i++ ) {
        			if ( i % 2 == 0 ) {
        				dig = cardNumber[i] * 2;

        				if ( dig > 9 ) {
        					dig1 = dig.toString().substr(0,1);
        					dig2 = dig.toString().substr(1,1);
        					arr[i] = parseInt(dig1, 10) + parseInt(dig2, 10);
        				} else {
        					arr[i] = dig;
        				}

        				total += parseInt(arr[i], 10);

        			} else {
        				arr[i] = parseInt(cardNumber[i], 10);
        				total += parseInt(arr[i], 10);
        			}
        		}

        		switch ( parseInt( cardNumber[0] ) ) {
        			case 0:
        				msg.push("Número incorreto");
        				break;
        			case 1:
        				tipo = "Empresas Aéreas";
        				break;
        			case 2:
        				tipo = "Empresas Aéreas";
        				break
        			case 3:
        				tipo = "Viagens e Entretenimento";
        				if ( parseInt( cardNumber[0] + cardNumber[1] ) == 34 || parseInt( cardNumber[0] + num[1]) == 37 ) {
                            operadora = "Amex";
                        }
        				if ( parseInt( num[0] + num[1]) == 36 ) {
                            operadora = "Diners";
                        }
        				break
        			case 4:
        				tipo = "Bancos e Instituições Financeiras";
        				operadora = "visa";
        				break
        			case 5:
        				if ( parseInt( num[0] + num[1] ) >= 51 && parseInt( num[0] + num[1]) <= 55 ) {
                            operadora = "Mastercard";
                        }
        				tipo = "Bancos e Instituições Financeiras";
        				operadora = "Mastercard"
        				break;
        			case 6:
        				tipo = "Bancos e Comerciais";
        				operadora = "";
        				break
        			case 7:
        				tipo = "Companhias de petróleo";
        				operadora = "";
        				break
        			case 8:
        				tipo = "Companhia de telecomunicações";
        				operadora = "";
        				break
        			case 9:
        				tipo = "Nacionais";
        				operadora = "";
        				break
        			default:
        				msg.push("Número incorreto");
        				break;
        			}
            }

            if ( msg.length > 0 ) {

                $('.number .frm-error-wrapper').addClass('has-error').children('.frm-error').text(msg[0]).parent().parent().addClass('has-error');
                $('.frm-error-wrapper.mobile').addClass('has-error').children('.frm-error').text('Campos contém erros. Corrija e tente novamente');
                validateFlag = false;

            } else {
        		if( total % 10 == 0 ){
        			validateFlag = true;
        		} else {
                    $('.number .frm-error-wrapper').addClass('has-error').children('.frm-error').text('Cartão inválido').parent().parent().addClass('has-error');
                    $('.frm-error-wrapper.mobile').addClass('has-error').children('.frm-error').text('Campos contém erros. Corrija e tente novamente');
                    validateFlag = false;
        		}
        	}

            // valida data do cartão
            var date = new Date();
            var monthNumber = date.getMonth() + 1;
            var year = date.getFullYear();

            if ( validadeAno == year || validadeMes.length == 0 || validadeAno.length == 0 ) {
                if ( validadeMes < monthNumber ) {
                    $('.expiration .frm-error-wrapper').addClass('has-error').children('.frm-error').text('Validade inválida').parent().parent().addClass('has-error');
                    $('.frm-error-wrapper.mobile').addClass('has-error').children('.frm-error').text('Campos contém erros. Corrija e tente novamente');
                    validateFlag = false;
                }
            } else {
                validateFlag = true;
            }

            // valida caso o nome esteja em branco
            if ( nomeTitular.length == 0 ) {
                $('.name .frm-error-wrapper').addClass('has-error').children('.frm-error').text('Esse campo não pode estar vazio').parent().parent().addClass('has-error');
                $('.frm-error-wrapper.mobile').addClass('has-error').children('.frm-error').text('Campos contém erros. Corrija e tente novamente');
                validateFlag = false;
            } else {
                validateFlag = true;
            }

            // valida o código de segurança do cartão
            if ( cardCode.length == 0 || cardCode.length != 3 ) {
                $('.code .frm-error-wrapper').addClass('has-error').children('.frm-error').text('Código inválido').parent().parent().addClass('has-error');
                $('.frm-error-wrapper.mobile').addClass('has-error').children('.frm-error').text('Campos em vermelho contém erros. Corrija e tente novamente');
                validateFlag = false;
            } else {
                validateFlag = true;
            }

            if ( validateFlag && msg.length == 0 ) {
                $('#payment-data, .plano-flow, .vipmodal-footer').slideUp();
                $('#payment-end').slideDown();

                this.btnFinish = false;
            }
        }
    }

    validateForm() {
        var date = new Date();
        var monthNumber = date.getMonth() + 1;
        var year = date.getFullYear();

        // console.log((<HTMLInputElement>event.target).value);
        // if ( (<HTMLInputElement>event.target).className == 'opcao-box' ) {
        //     (<HTMLInputElement>event.target).className += " active";
        // } else if ( (<HTMLInputElement>event.target).className == 'percetage' ) {
        //     (<HTMLInputElement>event.target.parentElement.parentElement).className += " active";
        // } else {
        //     (<HTMLInputElement>event.target.parentElement).className += " active";
        // }
    }
}
