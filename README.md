# postalypse
This is a javascript library that enables form submission to multiple locations.

###Usage

You can go postal with a given form element or use 'closest' to find the form nearest the executing script.

```html
<form>
   <input name='something' value='unimportant' />
   <span>...</span>
</form>
<script> Postalypse.gopostal('closest', ['/url/1', '/url/2']); </script>
```
