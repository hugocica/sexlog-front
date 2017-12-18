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
    nomeFirst = '';
    desconto = '';
    valorTotal = '';
    valorCurrency = '';
    valorInteger = 0;
    valorDecimal = 0;
    valorPeriodo = '';

    constructor() {
        this.getDataFromJson();
    }

    getDataFromJson() {
        $.ajax({
            dataType: 'json',
            method: 'GET',
            url: '../assets/js/data.json',
            data: {

            },
            success: function( data ) {
                console.log(data.plans);
                this.nomeFirst = data.plans[0].name;
                console.log(data.plans[0].name);
            }
        });
    }

    choosePlanOption(event: any) {
        // var elementos = document.querySelectorAll('.opcao-box');
        //
        // [].forEach.call(elementos, function(el) {
        //     el.classList.remove("active");
        // });
        $('.opcao-box').removeClass('active');

        if ( (<HTMLInputElement>event.target).className == 'opcao-box' ) {
            (<HTMLInputElement>event.target).className += " active";
        } else if ( (<HTMLInputElement>event.target).className == 'percetage' ) {
            (<HTMLInputElement>event.target.parentElement.parentElement).className += " active";
        } else {
            (<HTMLInputElement>event.target.parentElement).className += " active";
        }


    }

    onNextStepClick(event: any) {
        // caso seja para avançar para o formulário do cartão
        if ( this.nextStep && !this.btnFinish ) {
            // mainBtn.remove("next").className += " finish";
            $('#payment-info').slideUp().next().slideDown();
            $('#steps-btn').text('Concluir minha assinatura');
            $('.plano-flow .flow-content:first-of-type').removeClass('active').next().addClass('active');

            this.nextStep = false;
            this.btnFinish = true;
        } else {
            $('#payment-data, .plano-flow, .vipmodal-footer').slideUp();
            $('#payment-end').slideDown();
        }
    }
}
