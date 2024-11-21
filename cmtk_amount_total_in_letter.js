/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/runtime'], function (runtime) {

    // Conversion des nombres en anglais
    function convertNumberToWordsEn(amount) {
        var ones = ['','one','two','three','four','five','six','seven','eight','nine'];
        var teens = ['eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
        var tens = ['','ten','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
        var thousands = ['','thousand','million','billion'];

        function toWords(s) {
            s = s.toString().replace(/[\, ]/g,'');
            if (s != parseFloat(s)) return '';
            var x = s.indexOf('.');
            if (x == -1) x = s.length;
            if (x > 15) return 'too big';
            var n = s.split('');
            var str = '';
            var sk = 0;
            for (var i = 0; i < x; i++) {
                if ((x-i)%3==2) {
                    if (n[i] == '1') {
                        str += teens[Number(n[i+1])] + ' ';
                        i++;
                        sk=1;
                    } else if (n[i] != 0) {
                        str += tens[n[i]] + ' ';
                        sk=1;
                    }
                } else if (n[i] != 0) {
                    str += ones[n[i]] + ' ';
                    if ((x-i)%3==0) str += 'hundred ';
                    sk=1;
                }
                if ((x-i)%3==1) {
                    if (sk) str += thousands[(x-i-1)/3] + ' ';
                    sk=0;
                }
            }
            if (x != s.length) {
                str += 'and ';
                str += toWords(s.substring(x+1)) + ' cents';
            }
            return str.replace(/\s+/g,' ').trim();
        }

        return toWords(amount);
    }

    // Conversion des nombres en français
    function convertNumberToWordsFr(amount) {
        var ones = ['','un','deux','trois','quatre','cinq','six','sept','huit','neuf'];
        var teens = ['onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'];
        var tens = ['','dix','vingt','trente','quarante','cinquante','soixante','soixante-dix','quatre-vingt','quatre-vingt-dix'];
        var thousands = ['','mille','million','milliard'];

        function toWords(s) {
            s = s.toString().replace(/[\, ]/g,'');
            if (s != parseFloat(s)) return '';
            var x = s.indexOf('.');
            if (x == -1) x = s.length;
            if (x > 15) return 'trop grand';
            var n = s.split('');
            var str = '';
            var sk = 0;
            for (var i = 0; i < x; i++) {
                if ((x-i)%3==2) {
                    if (n[i] == '1') {
                        str += teens[Number(n[i+1])] + ' ';
                        i++;
                        sk=1;
                    } else if (n[i] != 0) {
                        str += tens[n[i]] + ' ';
                        sk=1;
                    }
                } else if (n[i] != 0) {
                    str += ones[n[i]] + ' ';
                    if ((x-i)%3==0) str += 'cent ';
                    sk=1;
                }
                if ((x-i)%3==1) {
                    if (sk) str += thousands[(x-i-1)/3] + ' ';
                    sk=0;
                }
            }
            if (x != s.length) {
                str += 'et ';
                str += toWords(s.substring(x+1)) + ' centimes';
            }
            return str.replace(/\s+/g,' ').trim();
        }

        return toWords(amount);
    }

    // Fonction exécutée avant l'enregistrement de la transaction
    function beforeSubmit(context) {
        var newRecord = context.newRecord;

        // Liste des types de transactions pris en charge
        var supportedTypes = [
            'invoice',         // Facture
            'estimate',        // Devis
            'salesorder',      // Commande client
            'purchaseorder',   // Commande fournisseur
            'creditmemo'       // Avoir
        ];

        // Vérifie si le type de transaction est supporté
        if (supportedTypes.indexOf(newRecord.type) === -1) {
            return; // Ignore si le type n'est pas pris en charge
        }

        if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
            var total = newRecord.getValue({ fieldId: 'total' });
            var userLanguage = runtime.getCurrentUser().getPreference({ name: 'language' }); // Langue utilisateur

            var totalInWords = '';

            if (userLanguage === 'fr') {
                totalInWords = convertNumberToWordsFr(total);
            } else { // Par défaut : anglais
                totalInWords = convertNumberToWordsEn(total);
            }

            newRecord.setValue({
                fieldId: 'custbody_total_in_words', // ID du champ personnalisé
                value: totalInWords,
                ignoreFieldChange: true
            });
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});

//Contact Me
//Iam Kto : www.linkedin.com/in/iamkto
//ktocrea.com | contact@ktocrea.com