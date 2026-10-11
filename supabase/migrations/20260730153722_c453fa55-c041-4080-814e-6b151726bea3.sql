DELETE FROM public.order_items WHERE order_id IN (SELECT id FROM public.orders WHERE total = 1 AND subtotal = 1 AND shipping_address = '{}'::jsonb);
DELETE FROM public.orders WHERE total = 1 AND subtotal = 1 AND shipping_address = '{}'::jsonb;

CREATE OR REPLACE FUNCTION public.place_order(p_subtotal numeric, p_total numeric, p_items jsonb)
RETURNS TABLE (id uuid, order_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_item jsonb;
BEGIN
  IF p_subtotal < 0 OR p_total < 0 THEN
    RAISE EXCEPTION 'Invalid amounts';
  END IF;
  IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 OR jsonb_array_length(p_items) > 50 THEN
    RAISE EXCEPTION 'Invalid items';
  END IF;

  INSERT INTO public.orders (user_id, status, subtotal, discount, total, payment_method, payment_status)
  VALUES (auth.uid(), 'pending', p_subtotal, 0, p_total, 'whatsapp', 'pending_confirmation')
  RETURNING * INTO v_order;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.order_items (order_id, product_id, variant_id, product_name, variant_label, addons, qty, unit_price, custom_message)
    VALUES (
      v_order.id,
      NULLIF(v_item->>'product_id','')::uuid,
      NULLIF(v_item->>'variant_id','')::uuid,
      left(coalesce(v_item->>'product_name','Item'), 200),
      left(v_item->>'variant_label', 100),
      coalesce(v_item->'addons', '[]'::jsonb),
      greatest(1, least(coalesce((v_item->>'qty')::int, 1), 999)),
      greatest(0, coalesce((v_item->>'unit_price')::numeric, 0)),
      left(v_item->>'custom_message', 300)
    );
  END LOOP;

  RETURN QUERY SELECT v_order.id, v_order.order_number;
END;
$$;

REVOKE ALL ON FUNCTION public.place_order(numeric, numeric, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_order(numeric, numeric, jsonb) TO anon, authenticated;