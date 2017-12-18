import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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
        var dataJson;

        jQuery.ajax({
            dataType: 'json',
            method: 'GET',
            url: '../assets/js/data.json',
            success: function( data ) {
                dataJson = data.plans;
            }
        });

        setTimeout(() => {
            this.firstName = dataJson[0].name;
            this.secondName = dataJson[1].name;
            this.thirdName = dataJson[2].name;
            jQuery('#plano-1 .economize').html(dataJson[0].discount);
            jQuery('#plano-2 .economize').html(dataJson[1].discount);
            jQuery('#plano-3 .economize').html(dataJson[2].discount);

            this.valorCurrency = dataJson[this.planID].price.currency;
            this.valorInteger = dataJson[this.planID].price.integer;
            this.valorDecimal = dataJson[this.planID].price.decimal;
            this.valorPeriodo = dataJson[this.planID].price.periodicy;
            this.planDetails = dataJson[this.planID].details;

            jQuery('.valor-total-container p').html(dataJson[this.planID].total);
            jQuery('.pagamento-tipo.credito p').html(dataJson[this.planID].payments[0]);
            jQuery('.pagamento-tipo.debito p').html(dataJson[this.planID].payments[1]);
            jQuery('.pagamento-tipo.boleto p').html(dataJson[this.planID].payments[2]);
        }, 5);
    }

    choosePlanOption(event: any) {
        jQuery('.opcao-box').removeClass('active');

        if ( (<HTMLInputElement>event.target).className == 'opcao-box' ) {
            (<HTMLInputElement>event.target).className += " active";
        } else if ( (<HTMLInputElement>event.target).className == 'percetage' ) {
            (<HTMLInputElement>event.target.parentElement.parentElement).className += " active";
        } else {
            (<HTMLInputElement>event.target.parentElement).className += " active";
        }

        var dataJson;
        this.planID = jQuery('.opcao-box.active').attr('data-id');

        jQuery.ajax({
            dataType: 'json',
            method: 'GET',
            url: '../assets/js/data.json',
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

            jQuery('.valor-total-container p').html(dataJson[this.planID].total);
            jQuery('.pagamento-tipo.credito p').html(dataJson[this.planID].payments[0]);
            jQuery('.pagamento-tipo.debito p').html(dataJson[this.planID].payments[1]);
            jQuery('.pagamento-tipo.boleto p').html(dataJson[this.planID].payments[2]);
        }, 5);
    }

    onNextStepClick(event: any) {
        // caso seja para avançar para o formulário do cartão
        if ( this.nextStep && !this.btnFinish ) {
            // mainBtn.remove("next").className += " finish";
            jQuery('#payment-info').slideUp().next().slideDown();
            jQuery('#steps-btn').text('Concluir minha assinatura');
            jQuery('.plano-flow .flow-content:first-of-type').removeClass('active').next().addClass('active');

            this.nextStep = false;
            this.btnFinish = true;
        } else {
            jQuery('#payment-data, .plano-flow, .vipmodal-footer').slideUp();
            jQuery('#payment-end').slideDown();
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
