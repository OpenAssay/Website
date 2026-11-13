# DNS setup for openassay.ca

Status: the `openassay.ca` and `www.openassay.ca` bindings are registered with Sites and pending DNS validation. The Namecheap changes below have **not been applied**. HTTPS will activate after domain and certificate validation complete.

## Namecheap Advanced DNS

1. Sign in to Namecheap, open **Domain List**, and select **Manage** beside `openassay.ca`.
2. Open **Advanced DNS → Host Records**.
3. Replace the existing apex parking/redirect configuration and the `www` parking CNAME with the routing records below. If `@` has a **URL Redirect Record**, remove that redirect. Remove any old parking A record for `@` pointing to `192.64.119.87`; replace the `www` CNAME pointing to `parkingpage.namecheap.com`.
4. Add the four TXT validation records. Set **TTL: Automatic** for every row and save the changes.

Preserve unrelated MX, mail, SPF, DKIM, DMARC, TXT, and other host records. Keep the existing nameservers, `dns1.registrar-servers.com` and `dns2.registrar-servers.com`; no nameserver change is required.

Namecheap uses `@` for the root domain and relative subdomain names in **Host**. Enter the hosts below exactly as shown; do not append `.openassay.ca`. For example, `_cf-custom-hostname.www` becomes `_cf-custom-hostname.www.openassay.ca`. This follows Namecheap’s [host-record instructions](https://www.namecheap.com/support/knowledgebase/article.aspx/434/2237/how-do-i-set-up-host-records-for-a-domain/) and [validation-host guidance](https://www.namecheap.com/support/knowledgebase/article.aspx/9646/2237/how-to-create-a-cname-record-for-your-domain/).

## Required records

| Type | Host | Value / Target | TTL |
| --- | --- | --- | --- |
| A Record | `@` | `162.159.143.30` | Automatic |
| A Record | `@` | `172.66.3.26` | Automatic |
| CNAME Record | `www` | `custom-domains.chatgpt.site.` | Automatic |
| TXT Record | `_openai-site-verification` | `openai-site-verification=UN0l6jsnf6KxGL2oh3uuKIoFJf7cQIEgBAPA-YYt5C4` | Automatic |
| TXT Record | `_cf-custom-hostname` | `09545e4d-7bc9-42a1-868d-dd203c943df2` | Automatic |
| TXT Record | `_openai-site-verification.www` | `openai-site-verification=YNCGO0pnUUysVw2D1MIgb3wvqUc_ibHf51asfXF0xVI` | Automatic |
| TXT Record | `_cf-custom-hostname.www` | `0e52c418-ba51-4e78-ac78-9508fcc69aa3` | Automatic |

Create two separate A records for `@`. Enter each TXT value as one string, without surrounding quotation marks; see Namecheap’s [TXT-record setup guide](https://www.namecheap.com/support/knowledgebase/article.aspx/317/2237/how-do-i-add-txtspfdkimdmarc-records-for-my-domain/). These verification values are intended to be public DNS records.

## After saving

Allow DNS caches to update, then refresh validation for both hostnames in Sites. Confirm domain validation and HTTPS are active before treating the custom domains as ready. Test both `https://openassay.ca` and `https://www.openassay.ca` once validation completes.
