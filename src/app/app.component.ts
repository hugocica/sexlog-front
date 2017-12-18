import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    nextStep = true;
    btnFinish = false;
    $ = jQuery;

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
    boletoTexto = ''

    constructor() {
        var dataJson;

        this.$.ajax({
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
            this.$('#plano-1 .economize').html(dataJson[0].discount);
            this.$('#plano-2 .economize').html(dataJson[1].discount);
            this.$('#plano-3 .economize').html(dataJson[2].discount);

            this.valorCurrency = dataJson[0].price.currency;
            this.valorInteger = dataJson[0].price.integer;
            this.valorDecimal = dataJson[0].price.decimal;
            this.valorPeriodo = dataJson[0].price.periodicy;

            this.$('.pagamento-tipo.credito p').html(dataJson[0].payments[0]);
            this.$('.pagamento-tipo.debito p').html(dataJson[0].payments[1]);
            this.$('.pagamento-tipo.boleto p').html(dataJson[0].payments[2]);
        }, 5);
    }

    choosePlanOption(event: any) {
        this.$('.opcao-box').removeClass('active');

        if ( (<HTMLInputElement>event.target).className == 'opcao-box' ) {
            (<HTMLInputElement>event.target).className += " active";
        } else if ( (<HTMLInputElement>event.target).className == 'percetage' ) {
            (<HTMLInputElement>event.target.parentElement.parentElement).className += " active";
        } else {
            (<HTMLInputElement>event.target.parentElement).className += " active";
        }

        var dataJson;
        var planID = this.$('.opcao-box.active').attr('data-id');

        this.$.ajax({
            dataType: 'json',
            method: 'GET',
            url: '../assets/js/data.json',
            success: function( data ) {
                dataJson = data.plans;
            }
        });

        setTimeout(() => {
            this.valorCurrency = dataJson[planID].price.currency;
            this.valorInteger = dataJson[planID].price.integer;
            this.valorDecimal = dataJson[planID].price.decimal;
            this.valorPeriodo = dataJson[planID].price.periodicy;

            this.$('.pagamento-tipo.credito p').html(dataJson[planID].payments[0]);
            this.$('.pagamento-tipo.debito p').html(dataJson[planID].payments[1]);
            this.$('.pagamento-tipo.boleto p').html(dataJson[planID].payments[2]);
        }, 5);
    }

    onNextStepClick(event: any) {
        // caso seja para avançar para o formulário do cartão
        if ( this.nextStep && !this.btnFinish ) {
            // mainBtn.remove("next").className += " finish";
            this.$('#payment-info').slideUp().next().slideDown();
            this.$('#steps-btn').text('Concluir minha assinatura');
            this.$('.plano-flow .flow-content:first-of-type').removeClass('active').next().addClass('active');

            this.nextStep = false;
            this.btnFinish = true;
        } else {
            this.$('#payment-data, .plano-flow, .vipmodal-footer').slideUp();
            this.$('#payment-end').slideDown();
        }
    }
}
