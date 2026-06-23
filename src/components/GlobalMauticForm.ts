export const GLOBAL_MAUTIC_FORM = `
<script type="text/javascript">
    /** This section is only needed once per page if manually copying **/
    if (typeof MauticSDKLoaded == 'undefined') {
        var MauticSDKLoaded = true;
        var head            = document.getElementsByTagName('head')[0];
        var script          = document.createElement('script');
        script.type         = 'text/javascript';
        script.src          = 'https://mkt.maiscorporativo.tur.br/media/js/mautic-form.js?v2f2e0c83';
        script.onload       = function() {
            MauticSDK.onLoad();
        };
        head.appendChild(script);
        var MauticDomain = 'https://mkt.maiscorporativo.tur.br';
        var MauticLang   = {
            'submittingMessage': "Por favor, aguarde..."
        }
    }else if (typeof MauticSDK != 'undefined') {
        MauticSDK.onLoad();
    }
</script>

<style type="text/css" scoped>
    .mauticform_wrapper { max-width: 600px; margin: 10px auto; }
    .mauticform-name { font-weight: bold; font-size: 1.5em; margin-bottom: 3px; }
    .mauticform-error { margin-bottom: 10px; color: red; }
    .mauticform-message { margin-bottom: 10px;color: green; }
    .mauticform-row { display: block; margin-bottom: 20px; }
    .mauticform-label { font-size: 1.1em; display: block; font-weight: bold; margin-bottom: 5px; color: #fff; }
    .mauticform-row.mauticform-required .mauticform-label:after { color: #e32; content: " *"; display: inline; }
    .mauticform-helpmessage { display: block; font-size: 0.9em; margin-bottom: 3px; color: #999; }
    .mauticform-errormsg { display: block; color: red; margin-top: 2px; }
    .mauticform-selectbox, .mauticform-input, .mauticform-textarea { width: 100%; padding: 0.8em 1em; border: 1px solid #004080; background: #002042; color: #fff; border-radius: 8px; box-sizing: border-box; }
    .mauticform-radiogrp-row { margin-bottom: 8px; color: #ccc; }
    .mauticform-button-wrapper .mauticform-button { display: inline-block; width: 100%; font-weight: 700; text-align: center; cursor: pointer; background: linear-gradient(135deg, #F78A2D, #d66f1c); color: #fff; border: none; padding: 14px 24px; font-size: 16px; border-radius: 12px; transition: transform 0.2s; }
    .mauticform-button-wrapper .mauticform-button:hover { transform: translateY(-2px); }
</style><style type="text/css" scoped>
    .mauticform-field-hidden { display:none }
</style>

<div id="mauticform_wrapper_portalpctshospedagemabradilanab2027lp1" class="mauticform_wrapper">
    <form autocomplete="false" role="form" method="post" action="https://mkt.maiscorporativo.tur.br/form/submit?formId=31" id="mauticform_portalpctshospedagemabradilanab2027lp1" data-mautic-form="portalpctshospedagemabradilanab2027lp1" enctype="multipart/form-data">
        <div class="mauticform-error" id="mauticform_portalpctshospedagemabradilanab2027lp1_error"></div>
        <div class="mauticform-message" id="mauticform_portalpctshospedagemabradilanab2027lp1_message"></div>
        <div class="mauticform-innerform">
          <div class="mauticform-page-wrapper mauticform-page-1" data-mautic-form-page="1">

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_nome" data-validate="nome" data-validation-type="text" class="mauticform-row mauticform-text mauticform-field-1 mauticform-required">
                <label id="mauticform_label_portalpctshospedagemabradilanab2027lp1_nome" for="mauticform_input_portalpctshospedagemabradilanab2027lp1_nome" class="mauticform-label">Primeiro Nome</label>
                <input id="mauticform_input_portalpctshospedagemabradilanab2027lp1_nome" name="mauticform[nome]" value="" class="mauticform-input" type="text">
                <span class="mauticform-errormsg" style="display: none;">* Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_ultimo_nome" data-validate="ultimo_nome" data-validation-type="text" class="mauticform-row mauticform-text mauticform-field-2 mauticform-required">
                <label id="mauticform_label_portalpctshospedagemabradilanab2027lp1_ultimo_nome" for="mauticform_input_portalpctshospedagemabradilanab2027lp1_ultimo_nome" class="mauticform-label">Sobrenome</label>
                <input id="mauticform_input_portalpctshospedagemabradilanab2027lp1_ultimo_nome" name="mauticform[ultimo_nome]" value="" class="mauticform-input" type="text">
                <span class="mauticform-errormsg" style="display: none;">* Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_cargo" data-validate="cargo" data-validation-type="text" class="mauticform-row mauticform-text mauticform-field-3 mauticform-required">
                <label id="mauticform_label_portalpctshospedagemabradilanab2027lp1_cargo" for="mauticform_input_portalpctshospedagemabradilanab2027lp1_cargo" class="mauticform-label">Cargo</label>
                <input id="mauticform_input_portalpctshospedagemabradilanab2027lp1_cargo" name="mauticform[cargo]" value="" class="mauticform-input" type="text">
                <span class="mauticform-errormsg" style="display: none;">*Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_empresa" data-validate="empresa" data-validation-type="text" class="mauticform-row mauticform-text mauticform-field-4 mauticform-required">
                <label id="mauticform_label_portalpctshospedagemabradilanab2027lp1_empresa" for="mauticform_input_portalpctshospedagemabradilanab2027lp1_empresa" class="mauticform-label">Empresa</label>
                <input id="mauticform_input_portalpctshospedagemabradilanab2027lp1_empresa" name="mauticform[empresa]" value="" class="mauticform-input" type="text">
                <span class="mauticform-errormsg" style="display: none;">*Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_email" data-validate="email" data-validation-type="email" class="mauticform-row mauticform-email mauticform-field-5 mauticform-required">
                <label id="mauticform_label_portalpctshospedagemabradilanab2027lp1_email" for="mauticform_input_portalpctshospedagemabradilanab2027lp1_email" class="mauticform-label">E-mail</label>
                <input id="mauticform_input_portalpctshospedagemabradilanab2027lp1_email" name="mauticform[email]" value="" class="mauticform-input" type="email">
                <span class="mauticform-errormsg" style="display: none;">* Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_whatsapp" data-validate="whatsapp" data-validation-type="tel" class="mauticform-row mauticform-tel mauticform-field-6 mauticform-required">
                <label id="mauticform_label_portalpctshospedagemabradilanab2027lp1_whatsapp" for="mauticform_input_portalpctshospedagemabradilanab2027lp1_whatsapp" class="mauticform-label">WhatsApp</label>
                <span class="mauticform-helpmessage">+55 DDD xxxxx-xxxx</span>
                <input id="mauticform_input_portalpctshospedagemabradilanab2027lp1_whatsapp" name="mauticform[whatsapp]" value="" class="mauticform-input" type="tel">
                <span class="mauticform-errormsg" style="display: none;">* Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_pacote" data-validate="pacote" data-validation-type="radiogrp" class="mauticform-row mauticform-radiogrp mauticform-field-7 mauticform-required">
                <label class="mauticform-label" for="mauticform_radiogrp_radio_pacote_DistribuidorAutorizado1">Participará no evento como</label>
                <div class="mauticform-radiogrp-row">                    <input name="mauticform[pacote]" class="mauticform-radiogrp-radio" id="mauticform_radiogrp_radio_pacote_DistribuidorAutorizado0" type="radio" value="Distribuidor Autorizado">
                    <label id="mauticform_radiogrp_label_pacote_DistribuidorAutorizado0" for="mauticform_radiogrp_radio_pacote_DistribuidorAutorizado0" class="mauticform-radiogrp-label">Distribuidor Autorizado</label>
                </div>
                <div class="mauticform-radiogrp-row">                    <input name="mauticform[pacote]" class="mauticform-radiogrp-radio" id="mauticform_radiogrp_radio_pacote_DistribuidorNaoAutorizado1" type="radio" value="Distribuidor Não Autorizado">
                    <label id="mauticform_radiogrp_label_pacote_DistribuidorNaoAutorizado1" for="mauticform_radiogrp_radio_pacote_DistribuidorNaoAutorizado1" class="mauticform-radiogrp-label">Distribuidor Não Autorizado</label>
                </div>
                <div class="mauticform-radiogrp-row">                    <input name="mauticform[pacote]" class="mauticform-radiogrp-radio" id="mauticform_radiogrp_radio_pacote_Industrias2" type="radio" value="Indústrias">
                    <label id="mauticform_radiogrp_label_pacote_Industrias2" for="mauticform_radiogrp_radio_pacote_Industrias2" class="mauticform-radiogrp-label">Indústrias</label>
                </div>
                <div class="mauticform-radiogrp-row">                    <input name="mauticform[pacote]" class="mauticform-radiogrp-radio" id="mauticform_radiogrp_radio_pacote_Farmacistas3" type="radio" value="Farmacistas">
                    <label id="mauticform_radiogrp_label_pacote_Farmacistas3" for="mauticform_radiogrp_radio_pacote_Farmacistas3" class="mauticform-radiogrp-label">Farmacistas</label>
                </div>
                <div class="mauticform-radiogrp-row">                    <input name="mauticform[pacote]" class="mauticform-radiogrp-radio" id="mauticform_radiogrp_radio_pacote_Visitantes4" type="radio" value="Visitantes">
                    <label id="mauticform_radiogrp_label_pacote_Visitantes4" for="mauticform_radiogrp_radio_pacote_Visitantes4" class="mauticform-radiogrp-label">Visitantes</label>
                </div>
                <div class="mauticform-radiogrp-row">                    <input name="mauticform[pacote]" class="mauticform-radiogrp-radio" id="mauticform_radiogrp_radio_pacote_Outros5" type="radio" value="Outros">
                    <label id="mauticform_radiogrp_label_pacote_Outros5" for="mauticform_radiogrp_radio_pacote_Outros5" class="mauticform-radiogrp-label">Outros</label>
                </div>
                <span class="mauticform-errormsg" style="display: none;">* Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_outros" data-mautic-form-show-on="pacote:Outros" data-mautic-form-expr="in" data-validate="outros" data-validation-type="text" class="mauticform-row mauticform-text mauticform-field-5  mauticform-field-hidden mauticform-required">
                <label id="mauticform_label_portalpctshospedagemabradilanab2027lp1_outros" for="mauticform_input_portalpctshospedagemabradilanab2027lp1_outros" class="mauticform-label">Outros</label>
                <input id="mauticform_input_portalpctshospedagemabradilanab2027lp1_outros" name="mauticform[outros]" value="" class="mauticform-input" type="text">
                <span class="mauticform-errormsg" style="display: none;">*Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_cidade_origem" data-validate="cidade_origem" data-validation-type="text" class="mauticform-row mauticform-text mauticform-field-8 mauticform-required">
                <label id="mauticform_label_portalpctshospedagemabradilanab2027lp1_cidade_origem" for="mauticform_input_portalpctshospedagemabradilanab2027lp1_cidade_origem" class="mauticform-label">Cidade de origem</label>
                <input id="mauticform_input_portalpctshospedagemabradilanab2027lp1_cidade_origem" name="mauticform[cidade_origem]" value="" class="mauticform-input" type="text">
                <span class="mauticform-errormsg" style="display: none;">* Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_hotel_chegada" data-validate="hotel_chegada" data-validation-type="date" class="mauticform-row mauticform-date mauticform-field-9 mauticform-required">
                <label id="mauticform_label_portalpctshospedagemabradilanab2027lp1_hotel_chegada" for="mauticform_input_portalpctshospedagemabradilanab2027lp1_hotel_chegada" class="mauticform-label">Hotel Chegada</label>
                <input id="mauticform_input_portalpctshospedagemabradilanab2027lp1_hotel_chegada" name="mauticform[hotel_chegada]" value="" class="mauticform-input" type="date">
                <span class="mauticform-errormsg" style="display: none;">*Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_hotel_saida1" data-validate="hotel_saida1" data-validation-type="date" class="mauticform-row mauticform-date mauticform-field-10 mauticform-required">
                <label id="mauticform_label_portalpctshospedagemabradilanab2027lp1_hotel_saida1" for="mauticform_input_portalpctshospedagemabradilanab2027lp1_hotel_saida1" class="mauticform-label">Hotel Saída</label>
                <input id="mauticform_input_portalpctshospedagemabradilanab2027lp1_hotel_saida1" name="mauticform[hotel_saida1]" value="" class="mauticform-input" type="date">
                <span class="mauticform-errormsg" style="display: none;">*Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_qtd_pessoas" data-validate="qtd_pessoas" data-validation-type="number" class="mauticform-row mauticform-number mauticform-field-11 mauticform-required">
                <label id="mauticform_label_portalpctshospedagemabradilanab2027lp1_qtd_pessoas" for="mauticform_input_portalpctshospedagemabradilanab2027lp1_qtd_pessoas" class="mauticform-label">Quantidade de Pessoas</label>
                <input id="mauticform_input_portalpctshospedagemabradilanab2027lp1_qtd_pessoas" name="mauticform[qtd_pessoas]" value="" class="mauticform-input" type="number">
                <span class="mauticform-errormsg" style="display: none;">* Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_precisara_de_transfer" data-validate="precisara_de_transfer" data-validation-type="radiogrp" class="mauticform-row mauticform-radiogrp mauticform-field-12 mauticform-required">
                <label class="mauticform-label" for="mauticform_radiogrp_radio_precisara_de_transfer_Sim1">Precisará de Transfer?</label>
                <div class="mauticform-radiogrp-row">                    <input name="mauticform[precisara_de_transfer]" class="mauticform-radiogrp-radio" id="mauticform_radiogrp_radio_precisara_de_transfer_Sim0" type="radio" value="Sim">
                    <label id="mauticform_radiogrp_label_precisara_de_transfer_Sim0" for="mauticform_radiogrp_radio_precisara_de_transfer_Sim0" class="mauticform-radiogrp-label">Sim</label>
                </div>
                <div class="mauticform-radiogrp-row">                    <input name="mauticform[precisara_de_transfer]" class="mauticform-radiogrp-radio" id="mauticform_radiogrp_radio_precisara_de_transfer_Nao1" type="radio" value="Não">
                    <label id="mauticform_radiogrp_label_precisara_de_transfer_Nao1" for="mauticform_radiogrp_radio_precisara_de_transfer_Nao1" class="mauticform-radiogrp-label">Não</label>
                </div>
                <span class="mauticform-errormsg" style="display: none;">*Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_precisa_de_aereo_ate_sao" data-validate="precisa_de_aereo_ate_sao" data-validation-type="radiogrp" class="mauticform-row mauticform-radiogrp mauticform-field-13 mauticform-required">
                <label class="mauticform-label" for="mauticform_radiogrp_radio_precisa_de_aereo_ate_sao_Sim1">Tem interesse em passagem aérea?</label>
                <div class="mauticform-radiogrp-row">                    <input name="mauticform[precisa_de_aereo_ate_sao]" class="mauticform-radiogrp-radio" id="mauticform_radiogrp_radio_precisa_de_aereo_ate_sao_Sim0" type="radio" value="Sim">
                    <label id="mauticform_radiogrp_label_precisa_de_aereo_ate_sao_Sim0" for="mauticform_radiogrp_radio_precisa_de_aereo_ate_sao_Sim0" class="mauticform-radiogrp-label">Sim</label>
                </div>
                <div class="mauticform-radiogrp-row">                    <input name="mauticform[precisa_de_aereo_ate_sao]" class="mauticform-radiogrp-radio" id="mauticform_radiogrp_radio_precisa_de_aereo_ate_sao_Nao1" type="radio" value="Não">
                    <label id="mauticform_radiogrp_label_precisa_de_aereo_ate_sao_Nao1" for="mauticform_radiogrp_radio_precisa_de_aereo_ate_sao_Nao1" class="mauticform-radiogrp-label">Não</label>
                </div>
                <span class="mauticform-errormsg" style="display: none;">* Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_deseja_receber_mensagens" data-validate="deseja_receber_mensagens" data-validation-type="radiogrp" class="mauticform-row mauticform-radiogrp mauticform-field-14 mauticform-required">
                <label class="mauticform-label" for="mauticform_radiogrp_radio_deseja_receber_mensagens_Nao1">Deseja receber mensagens pelo WhatsApp ?</label>
                <div class="mauticform-radiogrp-row">                    <input name="mauticform[deseja_receber_mensagens]" class="mauticform-radiogrp-radio" id="mauticform_radiogrp_radio_deseja_receber_mensagens_00" type="radio" value="0">
                    <label id="mauticform_radiogrp_label_deseja_receber_mensagens_00" for="mauticform_radiogrp_radio_deseja_receber_mensagens_00" class="mauticform-radiogrp-label">Não</label>
                </div>
                <div class="mauticform-radiogrp-row">                    <input name="mauticform[deseja_receber_mensagens]" class="mauticform-radiogrp-radio" id="mauticform_radiogrp_radio_deseja_receber_mensagens_11" type="radio" value="1">
                    <label id="mauticform_radiogrp_label_deseja_receber_mensagens_11" for="mauticform_radiogrp_radio_deseja_receber_mensagens_11" class="mauticform-radiogrp-label">Sim</label>
                </div>
                <span class="mauticform-errormsg" style="display: none;">* Campo obrigatório</span>
            </div>

            <div id="mauticform_portalpctshospedagemabradilanab2027lp1_submit" class="mauticform-row mauticform-button-wrapper mauticform-field-15">
                <button type="submit" name="mauticform[submit]" id="mauticform_input_portalpctshospedagemabradilanab2027lp1_submit" value="" class="mauticform-button btn btn-default">Enviar</button>
            </div>
            </div>
        </div>

        <input type="hidden" name="mauticform[formId]" id="mauticform_portalpctshospedagemabradilanab2027lp1_id" value="31">
        <input type="hidden" name="mauticform[return]" id="mauticform_portalpctshospedagemabradilanab2027lp1_return" value="">
        <input type="hidden" name="mauticform[formName]" id="mauticform_portalpctshospedagemabradilanab2027lp1_name" value="portalpctshospedagemabradilanab2027lp1">

        </form>
</div>
`;

