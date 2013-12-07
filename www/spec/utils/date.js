define(['utils/date', 'jasmine'], function(DateUtils){
	describe('DateUtils', function(){
		it('conversion date into proper ISO formatted date string', function(){
			var d = new Date(2010, 02, 12);
			expect(DateUtils.date2ISO(d)).toEqual('2010-03-12');
		});
		it('handling wrong argument type to produce empty string', function(){
			var d = null;
			expect(DateUtils.date2ISO(d)).toEqual('');
			d = 'some string';
			expect(DateUtils.date2ISO(d)).toEqual('');
		});
		it('conversion time into proper ISO formatted time string', function(){
			var d = new Date(0, 0, 0, 3, 24, 15);
			expect(DateUtils.time2ISO(d)).toEqual('03:24:15');
		});
		it('conversion datetime into proper ISO formatted string', function(){
			var d = new Date(2015, 06, 3, 3, 24, 15);
			expect(DateUtils.datetime2ISO(d)).toEqual('2015-07-03T03:24:15');
		});
	});
});
