namespace color_shirts
{
	internal class Program
	{
		static void Main(string[] args)
		{
			string[] Colors = { "red", "blue", "orange", "pink" };
			string[] Patterns = { "striped", "checked", "plain" };



			foreach (string color in Colors)
			{

				foreach (string pattern in Patterns)
				{

					Shirt shirt = new Shirt(color, pattern);
					shirt.Print();

					//new Shirt(color, pattern).Print();

					//Console.WriteLine(color  + ":" +  pattern);


				}
			}
		}

	}

	class Shirt
	{
		public string Color { get; set; }
		public string Pattern { get; set; }



		public Shirt(string color, string pattern)
		{

			Color = color;
			Pattern = pattern;


		}

		public void Print()
		{

			Console.WriteLine(Color + " " + Pattern + " Shirt");
		}
	}
}

