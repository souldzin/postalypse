# postalypse
This is a javascript library that enables form submission to multiple locations.

###Usage

   <form>
      <input name='something' value='unimportant' />
      <span>...</span>
   </form>
   <script> Postalypse.gopostal('closest', ['/url/1', '/url/2']); </script>
